import express from "express";
import {
  login,
  initialRegister,
  completeRegistration,
} from "../controllers/auth.controllers.js";

import passport from "passport";
import jwt from "jsonwebtoken";

import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT.toString(),
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Invalid domain" });
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });

    res.redirect(`${process.env.GOOGLE_SUCCESS_REDIRECT}?token=${token}`);
  }
);

router.route("/login").post(login);
router
  .route("/register/complete-profile")
  .put(authenticateJWT, completeRegistration);
router.route("/register").post(initialRegister);

export default router;
