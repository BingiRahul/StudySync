const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const quizController = require("../controllers/quizController");
const { activityMiddleware } = require("../utils/activityUtil");

router.use(authMiddleware);

router.post(
  "/generate-from-note",
  activityMiddleware("generated a quiz from a note"),
  quizController.generateQuizFromNote
);

router.post(
  "/question",
  activityMiddleware("created a quiz question"),
  quizController.createQuizQuestion
);

router.get("/topics", quizController.getQuizTopics);

router.get("/topic/:topicId", quizController.getQuizzesByTopic);

router.get("/:quizId", quizController.getQuizById);

router.post(
  "/attempt/:quizId",
  activityMiddleware("attempted a quiz"),
  quizController.recordQuizAttempt
);

router.get("/attempts/:quizId", quizController.getAttemptsByQuizId);

module.exports = router;
