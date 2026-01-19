import * as Booking from '../models/bookingModel.js';

export const createBooking = async (req, res) => {
  try {
    const { trip_id, full_name, email, contact_phone, started_date, num_people, total_price, special_requests } = req.body;

    if (!trip_id || !full_name || !email || !started_date || !num_people || !total_price) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    if (num_people <= 0) return res.status(400).json({ message: 'Number of people must be greater than 0.' });

    const booking = {
      user_id: req.user.id, 
      trip_id,
      full_name,
      email,
      contact_phone,
      started_date,
      num_people,
      total_price,
      special_requests,
      status: 'Pending'
    };

    const result = await Booking.createBooking(booking);
    res.status(201).json({ 
      message: 'Booking created successfully.', 
      bookingId: result.insertId,
      status: 'Pending'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required.' });
    }

    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only pay for your own bookings.' });
    }

    await Booking.updateBookingStatus(bookingId, 'Confirmed');

    res.json({ 
      success: true, 
      message: 'Payment confirmed. Your trip is now booked!',
      status: 'Confirmed'
    });
  } catch (err) {
    console.error('Payment Confirmation Error:', err);
    res.status(500).json({ message: 'Server error during payment confirmation.' });
  }
};

export const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.getAllBookings();
    } else {
      bookings = await Booking.getBookingsByUser(req.user.id);
    }
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required.' });

    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can update status.' });

    await Booking.updateBookingStatus(req.params.id, status);
    res.json({ message: 'Booking status updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete or Cancel a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingData = await Booking.getBookingById(id);
    
    if (!bookingData) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.user.role !== 'admin' && bookingData.user_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: You do not have permission to delete this.' 
      });
    }

    const result = await Booking.deleteBooking(id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Delete failed' });
    }

  } catch (error) {
    console.error("CRASH IN DELETE_BOOKING:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};