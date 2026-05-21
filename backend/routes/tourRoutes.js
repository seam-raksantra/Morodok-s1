import express from 'express';
const router = express.Router();
import { getAllTours, getTourById } from '../controllers/tourController.js';

// This matches: GET /api/tours
router.get('/', getAllTours);

// This matches: GET /api/tours/:id
router.get('/:id', getTourById);

export default router;