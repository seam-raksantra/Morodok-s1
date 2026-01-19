import db from "../config/db.js";

/* GET all destinations */
export const getAllDestinations = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM destination");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET destination by ID */
export const getDestinationById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM destination WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE destination */
export const createDestination = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      image_url,
      destination_type,
      duration,
      difficulty_type
    } = req.body;

    await db.query(
      `INSERT INTO destination 
      (name, description, location, image_url, destination_type, duration, difficulty_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, location, image_url, destination_type, duration, difficulty_type]
    );

    res.status(201).json({ message: "Destination created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE destination */
export const updateDestination = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      image_url,
      destination_type,
      duration,
      difficulty_type
    } = req.body;

    await db.query(
      `UPDATE destination SET
        name = ?, description = ?, location = ?, image_url = ?,
        destination_type = ?, duration = ?, difficulty_type = ?
       WHERE id = ?`,
      [
        name,
        description,
        location,
        image_url,
        destination_type,
        duration,
        difficulty_type,
        req.params.id
      ]
    );

    res.json({ message: "Destination updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE destination */
export const deleteDestination = async (req, res) => {
  try {
    await db.query("DELETE FROM destination WHERE id = ?", [req.params.id]);
    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
