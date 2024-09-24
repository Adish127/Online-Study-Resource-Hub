import mongoose from "mongoose";

const recentActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model
    required: true,
  },
  actionType: {
    type: String,
    enum: [
      "login",
      "logout",
      "upload",
      "like",
      "comment",
      "view",
      "joinGroup",
      "updateProfile",
      "download",
    ],
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource", // Refers to the Resource model (if applicable)
    required: false,
  },
  description: {
    type: String,
    required: false, // Optional detailed description (e.g., comment text)
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);

export default RecentActivity;
