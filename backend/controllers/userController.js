import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================
// REGISTER
// ========================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      token,
      user: { id: userId, name, email, role: "user" }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// LOGIN
// ========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// ADMIN DASHBOARD STATS
// ========================
export const getAdminStats = async (req, res) => {
  try {
    // 1. Monthly Revenue for Area Chart (Using 'booking' and 'booked_at')
    const [revenueRows] = await db.query(`
      SELECT 
        DATE_FORMAT(booked_at, '%b') AS name, 
        COALESCE(SUM(total_price), 0) AS revenue,
        COUNT(id) AS sales
      FROM booking
      GROUP BY name, MONTH(booked_at)
      ORDER BY MONTH(booked_at) ASC
    `);

    // 2. Weekly Data for Bar Chart (Using 'booking' and 'booked_at')
    const [weeklyRows] = await db.query(`
      SELECT 
        LEFT(DAYNAME(booked_at), 1) AS day, 
        COALESCE(SUM(total_price), 0) AS revenue,
        COUNT(id) AS sales
      FROM booking 
      WHERE booked_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY day, DAYOFWEEK(booked_at)
      ORDER BY DAYOFWEEK(booked_at) ASC
    `);

    // 3. Totals for Dashboard Cards
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM user");
    const [[{ totalTrips }]] = await db.query("SELECT COUNT(*) AS totalTrips FROM destination");
    const [[{ totalProfit }]] = await db.query("SELECT COALESCE(SUM(total_price), 0) AS totalProfit FROM booking");
    const [[{ totalBookings }]] = await db.query("SELECT COUNT(*) AS totalBookings FROM booking");

    res.json({
      revenueData: revenueRows,
      weeklyData: weeklyRows,
      totals: {
        users: totalUsers || 0,
        destinations: totalTrips || 0,
        profit: totalProfit || 0,
        bookings: totalBookings || 0
      }
    });
  } catch (err) {
    console.error("Stats Error:", err.message);
    res.status(200).json({
      revenueData: [],
      weeklyData: [],
      totals: { users: 0, destinations: 0, profit: 0, bookings: 0 }
    });
  }
};

// ========================
// GET ALL BOOKINGS (For User Booking List)
// ========================
export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, full_name, trip_id, total_price, booked_at, status 
      FROM booking 
      ORDER BY booked_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// GET ALL USERS
// ========================
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM user");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};