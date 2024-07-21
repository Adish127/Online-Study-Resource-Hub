import express from "express";
import {
  login,
  initialRegister,
  completeRegistration,
} from "../controllers/auth.controllers.js";

import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router.route("/login").post(login);
router
  .route("/register/complete-profile")
  .put(authenticateJWT, completeRegistration);
router.route("/register").post(initialRegister);

export default router;
