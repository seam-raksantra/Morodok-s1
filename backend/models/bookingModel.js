import db from '../config/db.js';

export const createBooking = async (booking) => {
  const sql = `
    INSERT INTO booking 
    (user_id, trip_id, full_name, email, contact_phone, started_date, num_people, total_price, booked_at, status, special_requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
  `;
  const values = [
    booking.user_id || null,
    booking.trip_id || null,
    booking.full_name || null,
    booking.email || null,
    booking.contact_phone || null,
    booking.started_date || null,
    booking.num_people || 0,
    booking.total_price || 0,
    booking.status || 'Pending', // Default to 'Pending'
    booking.special_requests || null
  ];

  const [result] = await db.execute(sql, values);
  return result;
};

// This is the function our confirmPayment controller uses!
export const updateBookingStatus = async (id, status) => {
  const [result] = await db.execute('UPDATE booking SET status = ? WHERE id = ?', [status, id]);
  return result;
};

/* --- Existing Helper Methods (Keep these as they are) --- */
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