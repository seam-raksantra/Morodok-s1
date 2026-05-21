import db from '../config/db.js';

export const createBooking = async (booking) => {
  // FIXED: Ensure we have exactly 11 placeholders matching our 11 parameters
  const sql = `
    INSERT INTO booking 
    (user_id, trip_id, tour_id, full_name, email, contact_phone, started_date, num_people, total_price, booked_at, status, special_requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    booking.user_id || null,          // 1
    booking.trip_id || null,          // 2
    booking.tour_id || null,          // 3
    booking.full_name || null,        // 4
    booking.email || null,            // 5
    booking.contact_phone || null,    // 6
    booking.started_date || null,      // 7
    booking.num_people || 0,          // 8
    booking.total_price || 0,         // 9
    booking.booked_at || new Date(),  // 10: FIXED: Mapped explicit date generation to booked_at
    booking.status || 'Pending',      // 11: Mapped status cleanly to the 11th index
    booking.special_requests || null  // 12: Mapped special_requests cleanly to the 12th index
  ];

  const [result] = await db.execute(sql, values);
  return result;
};

// This is the function our confirmPayment controller uses!
export const updateBookingStatus = async (id, status) => {
  const [result] = await db.execute('UPDATE booking SET status = ? WHERE id = ?', [status, id]);
  return result;
};

/* --- Existing Helper Methods (Kept exactly as they were) --- */
export const getBookingById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM booking WHERE id = ?', [id]);
  return rows[0];
};

export const getBookingsByUser = async (user_id) => {
  const [rows] = await db.execute('SELECT * FROM booking WHERE user_id = ?', [user_id]);
  return rows;
};

export const getAllBookings = async () => {
  const [rows] = await db.execute('SELECT * FROM booking');
  return rows;
};

export const deleteBooking = async (id) => {
  const [result] = await db.query('DELETE FROM booking WHERE id = ?', [id]);
  return result;
};