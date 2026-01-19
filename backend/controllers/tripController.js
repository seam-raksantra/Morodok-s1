import db from "../config/db.js";

/* GET all trips */
export const getAllTrips = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM trips");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET trip by ID */
export const getTripById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM trips WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE trip */
export const createTrip = async (req, res) => {
  try {
    const {
      destination_id,
      name,
      duration,
      difficulty_type,
      location,
      price,
      description,
      num_people,
      image_url
    } = req.body;

    await db.query(
      `INSERT INTO trips
      (destination_id, name, duration, difficulty_type, location, price, description, num_people, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        destination_id,
        name,
        duration,
        difficulty_type,
        location,
        price,
        description,
        num_people,
        image_url
      ]
    );

    res.status(201).json({ message: "Trip created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE trip */
export const updateTrip = async (req, res) => {
  try {
    const {
      destination_id,
      name,
      duration,
      difficulty_type,
      location,
      price,
      description,
      num_people
    } = req.body;

    await db.query(
      `UPDATE trips SET
        destination_id = ?, name = ?, duration = ?, difficulty_type = ?,
        location = ?, price = ?, description = ?, num_people = ?
       WHERE id = ?`,
      [
        destination_id,
        name,
        duration,
        difficulty_type,
        location,
        price,
        description,
        num_people,
        req.params.id
      ]
    );

    res.json({ message: "Trip updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE trip */
export const deleteTrip = async (req, res) => {
  try {
    await db.query("DELETE FROM trips WHERE id = ?", [req.params.id]);
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
