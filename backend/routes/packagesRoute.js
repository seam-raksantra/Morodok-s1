import express from "express";
import { getAllPackages } from "../controllers/packagesController.js";

const router = express.Router();

router.get('/', getAllPackages);

export default router;