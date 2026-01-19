import express from 'express';
import * as BookingController from '../controllers/bookingController.js';
// Change verifyToken to protect
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Update verifyToken to protect here as well
router.post('/', protect, BookingController.createBooking);
router.get('/', protect, BookingController.getBookings);
router.get('/:id', protect, BookingController.getBooking);
router.put('/:id', protect, BookingController.updateBooking);
router.delete('/:id', protect, BookingController.deleteBooking);

router.post('/confirm-payment', protect, BookingController.confirmPayment);

export default router;