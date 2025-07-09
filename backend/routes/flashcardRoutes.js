const express = require("express");
const router = express.Router();
const {
  getFlashcards,
  updateFlashcardCard,
} = require("../controllers/flashcardController");
const authMiddleware = require("../middleware/authMiddleware");
const { activityMiddleware } = require("../utils/activityUtil");

router.get("/", authMiddleware, getFlashcards);

router.patch(
  "/:topicId/cards/:cardId",
  authMiddleware,
  activityMiddleware("updated a flashcard"),
  updateFlashcardCard
);

module.exports = router;
