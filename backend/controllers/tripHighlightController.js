import pool from "../config/db.js";

export const getTripHighlights = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        trips_highlights,
        whats_include,
        best_season
      FROM tripshighlights
      WHERE trip_id = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.json(null);
    }

    res.json(rows[0]); // ✅ return object
  } catch (err) {
    console.error("Trip highlights error:", err);
    res.status(500).json({ error: err.message });
  }
};
