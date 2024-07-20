import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";

// Controllers for user profile management, not by admin
// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "username",
      "password",
      "name",
      "department",
      "bio",
    ];

    const updateFields = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    if (updateFields.password) {
      updateFields.password = await bcryptjs.hash(updateFields.password, 10);
    }

    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controllers for user management, by admin
// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const allowedUpdates = [
      "username",
      "password",
      "email",
      "role",
      "name",
      "department",
      "bio",
      "uploadedResources",
      "studyGroups",
      "notifications",
    ];

    const updateFields = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    if (updateFields.password) {
      updateFields.password = await bcryptjs.hash(updateFields.password, 10);
    }

    console.log(updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New route for profile updation, using multer and cloudinary
const updateUserProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "/userProfiles",
      // Rename the file
      public_id: `${req.user.id}_${Date.now()}_profile`,
    });

    user.profilePicture = result.secure_url;

    await user.save();

    res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePic,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
