import express from "express";

import { createResource } from "../controllers/resource.controllers.js";
import { authenticateJWT } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/").post(authenticateJWT, upload.single("file"), createResource);

export default router;
