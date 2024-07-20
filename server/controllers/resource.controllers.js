import Resource from "../models/resource.model.js";
import User from "../models/user.model.js";

import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// For admin
// Get, create, update, delete
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    // Create resource and upload it to cloudinary
    const uploader = await User.findById(req.user.id);

    if (!uploader) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    // Check whether the user already uplaods the file
    const existingResource = await Resource.findOne({
      fileName,
      uploadedBy: uploader._id,
    });

    if (existingResource) {
      return res.status(400).json({ message: "File already exists" });
    }

    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: `resources/${req.user.id}`,
            public_id: `${Date.now()}_${req.file.originalname.split(".")[0]}`,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    // Upload the file to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const newResource = new Resource({
      fileName,
      fileUrl: result.url,
      uploadedBy: uploader._id,
    });

    const savedResource = await newResource.save();

    uploader.uploadedResources.push(savedResource._id);
    await uploader.save();

    res.status(201).json({ message: "Upload successful!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResource = async (req, res) => {};

const updateResource = async (req, res) => {};

const deleteResource = async (req, res) => {};

// For user
// Create resource file, delete their resource file, browse resources, search resources, filter resources
const uploadResourceFile = async (req, res) => {};

const deleteResourceFile = async (req, res) => {};

// For faculty
// Share their own study materials
const shareResource = async (req, res) => {};

// For all
// Search resources, filter resources, manage resource access, assign resource
const searchResources = async (req, res) => {};

const filterResources = async (req, res) => {};

const manageResourceAccess = async (req, res) => {};

const assignResource = async (req, res) => {};

export {
  getResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
  uploadResourceFile,
  deleteResourceFile,
  shareResource,
  searchResources,
  filterResources,
  manageResourceAccess,
  assignResource,
};
