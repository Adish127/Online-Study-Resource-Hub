import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePic,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";

import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/profile").get(authenticateJWT, getUserProfile);
router.route("/profile/update").put(authenticateJWT, updateUserProfile);
router
  .route("/profile/updatepic")
  .put(authenticateJWT, upload.single("profile"), updateUserProfilePic);

router.route("/").get(authenticateJWT, verifyAdmin, getUsers);
router.route("/:id").get(authenticateJWT, verifyAdmin, getUserById);
router.route("/:id").put(authenticateJWT, verifyAdmin, updateUser);
router.route("/:id").delete(authenticateJWT, verifyAdmin, deleteUser);

export default router;
