const mongoose = require("mongoose");

const quizTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  tags: [String],
  quizCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });


const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "QuizTopic", required: true },
  questions: [
    {
      text: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    }
  ],
  lastScore: { type: Number, default: null },
  estimatedTime: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
}, { timestamps: true });


const QuizTopic = mongoose.model("QuizTopic", quizTopicSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = {
  QuizTopic,
  Quiz,
  QuizAttempt
};