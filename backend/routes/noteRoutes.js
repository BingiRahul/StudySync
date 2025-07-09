const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const auth = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { activityMiddleware } = require("../utils/activityUtil");

router.post(
  "/",
  auth,
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  activityMiddleware("created a note"),
  noteController.createNote
);

router.get("/", auth, noteController.getNotes);
router.get("/:id", auth, noteController.getNoteById);

router.delete(
  "/:id",
  auth,
  activityMiddleware("deleted a note"),
  noteController.deleteNote
);

router.post(
  "/:id/regenerate-summary",
  auth,
  activityMiddleware("regenerated a note summary"),
  noteController.regenerateSummary
);

router.post(
  "/:id/regenerate-tags",
  auth,
  activityMiddleware("regenerated note tags"),
  noteController.regenerateTags
);

module.exports = router;
