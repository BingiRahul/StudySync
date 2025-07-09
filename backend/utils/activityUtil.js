const User = require("../models/user");
const ActivityLog = require("../models/activityLog");

// Update user streak based on their last activity
async function updateUserStreak(userId) {
  const todayStr = new Date().toISOString().substring(0, 10);

  const user = await User.findById(userId);
  if (!user) return;

  if (!user.lastActivityDate) {
    user.streak = 1;
  } else {
    const prevDate = new Date(user.lastActivityDate);
    const today = new Date(todayStr);
    const diffDays = Math.floor((today - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    // If diffDays === 0, same day → do nothing
  }

  user.lastActivityDate = todayStr;
  await user.save();
}

// Save an activity log
async function logUserActivity(userId, action, extraData = {}) {
  await ActivityLog.create({
    userId,
    action,
    metadata: extraData,
  });
}

// Format date into "x minutes ago"
function timeAgo(date) {
  const now = new Date();
  const diff = (now - new Date(date)) / 1000; // in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
}

// Middleware to update streak + log activity
function activityMiddleware(action) {
  return async (req, res, next) => {
    try {
      await updateUserStreak(req.user.id);
      await logUserActivity(req.user.id, action);
      next();
    } catch (error) {
      console.error("Activity middleware error:", error);
      next();
    }
  };
}

module.exports = {
  updateUserStreak,
  logUserActivity,
  timeAgo,
  activityMiddleware,
};
