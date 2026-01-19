import express from "express";
import { login, register, getAdminStats, getAllUsers, getAllBookings } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  res.json({ userId: req.user.id, role: req.user.role });
});

router.get("/all-users", protect, adminOnly, getAllUsers);

router.get("/admin-stats", protect, adminOnly, getAdminStats);

router.get("/all-bookings", protect, adminOnly, getAllBookings);

export default router;