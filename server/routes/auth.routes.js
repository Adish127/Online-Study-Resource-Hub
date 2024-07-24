import express from "express";
import {
  login,
  initialRegister,
  completeRegistration,
} from "../controllers/auth.controllers.js";

import passport from "passport";

import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // console.log(req.user);
    res.redirect("http://localhost:3000");
  }
);

router.route("/login").post(login);
router
  .route("/register/complete-profile")
  .put(authenticateJWT, completeRegistration);
router.route("/register").post(initialRegister);

export default router;
