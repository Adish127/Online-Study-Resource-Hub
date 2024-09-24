import express from "express";
import {
  logActivity,
  getAllRecentActivities,
  getRecentActivitiesByUser,
  getActivitiesByType,
} from "../controllers/recentActivity.controllers";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/log").post(authenticateJWT, logActivity);

router.route("/all").get(authenticateJWT, verifyAdmin, getAllRecentActivities);

router.route("/user/:userId").get(authenticateJWT, getRecentActivitiesByUser);

router.route("/type/:actionType").get(authenticateJWT, getActivitiesByType);

export default router;
