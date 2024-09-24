// Controllers to log all activities of user like
// "login", "logout", "upload", "like", "comment", "view", "joinGroup", "updateProfile", "download"
import RecentActivity from "../models/recentActivity.model";

// Log recent activity
const logActivity = async (req, res) => {
  try {
    const { actionType, resourceId, description } = req.body;
    const recentActivity = new RecentActivity({
      userId: req.user.id,
      actionType,
      resourceId,
      description,
    });

    await recentActivity.save();
    res
      .status(201)
      .json({ message: "Activity logged", activity: recentActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recent activities
const getAllRecentActivities = async (req, res) => {
  try {
    // Optionally, filter by action type or resource
    const { actionType, resourceId } = req.query;

    let filter = {};
    if (actionType) filter.actionType = actionType;
    if (resourceId) filter.resourceId = resourceId;

    const activities = await RecentActivity.find(filter)
      .sort({ timestamp: -1 }) // Most recent first
      .limit(50); // Fetch the latest 50 activities (adjust as needed)

    return res.status(200).json({
      message: "All activities fetched successfully",
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

// Get recent activities of a user
const getRecentActivitiesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find recent activities of the user, ordered by most recent
    const activities = await RecentActivity.find({ userId })
      .sort({ timestamp: -1 }) // Sort by timestamp, newest first
      .limit(10); // Limit to the latest 10 activities

    return res.status(200).json({
      message: "User activities fetched successfully",
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user activities",
      error: error.message,
    });
  }
};

const getActivitiesByType = async (req, res) => {
  try {
    const { actionType } = req.params;

    // Fetch activities of a specific type
    const activities = await RecentActivity.find({ actionType })
      .sort({ timestamp: -1 })
      .limit(10);

    return res.status(200).json({
      message: `${actionType} activities fetched successfully`,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to fetch ${actionType} activities`,
      error: error.message,
    });
  }
};

export {
  logActivity,
  getAllRecentActivities,
  getRecentActivitiesByUser,
  getActivitiesByType,
};
