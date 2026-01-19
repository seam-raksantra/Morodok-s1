import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import tripHighlightRoutes from "./routes/tripHighlightRoutes.js";
import destinationHighlightRoutes from "./routes/destinationHighlightRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tripshighlights", tripHighlightRoutes);
app.use("/api/destinationhighlights", destinationHighlightRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
