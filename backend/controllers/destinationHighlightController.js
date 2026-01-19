import pool from "../config/db.js";

export const getDestinationHighlights = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM destinationhighlights WHERE destination_id = ?",
      [req.params.destination_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
