import db from '../config/db.js';

const Packages = {
    getAll: async () => {
        const sql = `
            SELECT
                t.tour_id,
                l.location_name,
                t.title,
                t.description,
                t.base_price,
                t.duration_category,
                t.average_rating,
                t.is_eco_friendly,
                (SELECT image_url FROM tour_images WHERE tour_id = t.tour_id AND is_primary = 1 LIMIT 1) AS thumbnail
            FROM tours t
            JOIN locations l ON t.location_id = l.location_id
        `;
        
        try {
            // Using the promise-based query
            const [rows] = await db.query(sql);
            return rows;
        } catch (error) {
            console.error("Database Query Error:", error);
            throw error;
        }
    }
};

export default Packages;