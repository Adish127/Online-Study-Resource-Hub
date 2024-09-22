import express from "express";

import {
  getResources,
  getResource,
  deleteResource,
  updateResourceFile,
  deleteResourceFile,
  createResource,
  searchAndFilterResources,
  manageResourceAccess,
  browseResources,
  likeResource,
  getMyResources,
  viewResource,
} from "../controllers/resource.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/my-resources").get(authenticateJWT, getMyResources);
router.route("/browse").get(authenticateJWT, browseResources);
router
  .route("/upload")
  .post(authenticateJWT, upload.single("file"), createResource);
router
  .route("/update/:id")
  .put(authenticateJWT, upload.single("file"), updateResourceFile);
router.route("/delete/:id").delete(authenticateJWT, deleteResourceFile);

router.route("/search").get(authenticateJWT, searchAndFilterResources);
router.route("/view/:id").get(authenticateJWT, viewResource);
router.route("/update-access/:id").put(authenticateJWT, manageResourceAccess);
router.route("/like/:id").put(authenticateJWT, likeResource);

router.route("/").get(authenticateJWT, verifyAdmin, getResources);
router.route("/:id").get(authenticateJWT, verifyAdmin, getResource);
router.route("/:id").delete(authenticateJWT, verifyAdmin, deleteResource);

export default router;
