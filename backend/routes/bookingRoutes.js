import express from 'express';
import * as BookingController from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// --- Standard Booking Management Routes (Protected) ---
router.post('/', protect, BookingController.createBooking);
router.get('/', protect, BookingController.getBookings);
router.get('/:id', protect, BookingController.getBooking);
router.put('/:id', protect, BookingController.updateBooking);
router.delete('/:id', protect, BookingController.deleteBooking);

// --- Traditional Payment Route (Protected) ---
router.post('/confirm-payment', protect, BookingController.confirmPayment);

// --- Real Bakong Payment Sync Routes (Protected) ---
router.post('/generate-bakong-qr', protect, BookingController.generateBakongQR);
router.get('/check-bakong-status/:bookingId', protect, BookingController.checkBakongStatus);
router.post('/verify-bakong-payment', protect, BookingController.verifyBakongPayment);
// Debug route to inspect in-memory active transactions (admin only)
router.get('/debug/active-transactions', protect, BookingController.getActiveTransactions);

export default router;