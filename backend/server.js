import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path"; // Added to handle static directory resolution

import userRoutes from "./routes/userRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import tripHighlightRoutes from "./routes/tripHighlightRoutes.js";
import destinationHighlightRoutes from "./routes/destinationHighlightRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';
import packagesRoute from './routes/packagesRoute.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { initTelegramPolling } from './src/services/telegramPolling.js';

const app = express();

app.use(cors());
app.use(express.json());

// 2. EXPOSE THE UPLOADS FOLDER STATICALLY SO FRONTEND REACT CAN ACCESS USER TRIP PHOTOS
app.use('/uploads/reviews', express.static('public/uploads/reviews'));

app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tripshighlights", tripHighlightRoutes);
app.use("/api/destinationhighlights", destinationHighlightRoutes);
app.use('/api/bookings', bookingRoutes);

app.use('/api', packagesRoute);
app.use('/api/tours', tourRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(5000, () => {
  console.log("=================================================");
  console.log("🚀 Server running smoothly on http://localhost:5000");
  console.log(`🎯 Telegram Bot Subsystem Target ID: ${process.env.TELEGRAM_ALLOWED_CHAT_ID || "364860328"}`);
  console.log("=================================================");

  // Trigger the asynchronous long-polling background monitor thread
  initTelegramPolling();
});