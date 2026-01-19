import express from "express";
import { getTripHighlights } from "../controllers/tripHighlightController.js";

const router = express.Router();

router.get("/:id", getTripHighlights);

export default router;