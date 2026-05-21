import db from '../config/db.js';

const Tour = {
  // Method for the Listing Page
  findAll: async () => {
    // Including price explicitly ensures your listing page can display it
    const [rows] = await db.execute('SELECT *, prices FROM tour_packages WHERE is_active = 1');
    return rows;
  },

  // Method for the Details Page
  findById: async (id) => {
    try {
      // 1. Main Tour (Now includes the 'price' column automatically via *)
      const [tours] = await db.execute(
        'SELECT * FROM tour_packages WHERE id = ? AND is_active = 1', 
        [id]
      );
      
      const tour = tours[0];
      if (!tour) return null;

      // 2. Features (Inclusions)
      const [features] = await db.execute(
        'SELECT feature_label, is_included FROM tour_features WHERE tour_packages_id = ?', 
        [id]
      );

      // 3. Sections (Accordions)
      const [sections] = await db.execute(
        'SELECT section_title, section_content FROM tour_sections WHERE tour_packages_id = ?', 
        [id]
      );

      // 4. Destinations
      const [destinations] = await db.execute(
        'SELECT title, image_url FROM feature_destinations WHERE tour_id = ?', 
        [id]
      );
      
      // 5. Operator Details
      const [operator] = await db.execute(
        'SELECT name, profile_image_url, rating_avg, total_reviews FROM operators WHERE id = ?', 
        [tour.operator_id]
      );

      // The returned object now contains 'tour.price' which the BookingForm needs
      return {
        ...tour,
        features,
        sections,
        destinations,
        operator: operator[0] || null // Ensure we return a single object, not an array
      };
      
    } catch (error) {
      console.error("Database Error:", error);
      throw error;
    }
  }
};

export default Tour;