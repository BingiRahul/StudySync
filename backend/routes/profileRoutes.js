const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const { activityMiddleware } = require("../utils/activityUtil");

router.get("/me", authMiddleware, profileController.getUserProfile);

router.put(
  "/me",
  authMiddleware,
  activityMiddleware("updated profile"),
  profileController.updateUserProfile
);

module.exports = router;
