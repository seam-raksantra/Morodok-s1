import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/:destination_id", async (req, res) => {
    try {
        const [rows] = await pool.query(
        "SELECT * FROM destinationhighlights WHERE destination_id = ?",
        [req.params.destination_id]
    );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;