const User = require("../models/user");
const Note = require("../models/note");
const Flashcard = require("../models/flashcard");
const { Quiz, QuizAttempt } = require("../models/quiz");
const ActivityLog = require("../models/activityLog");
const { generateQuoteOfTheDay } = require("../utils/quoteUtils");
const { timeAgo } = require("../utils/activityUtil");

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user name and streak
    const user = await User.findById(userId).select("name streak");

    // Notes
    const notes = await Note.find({ userId }).select("aiSummary");
    const notesCount = notes.length;

    // Total summaries count across all notes
    const summariesCount = notes.reduce(
      (sum, note) => sum + (note.aiSummary?.length || 0),
      0
    );

    // Flashcards
    const flashcards = await Flashcard.find({ userId });
    const flashcardsCount = flashcards.length;

    // Quizzes
    const quizzes = await Quiz.find({ user: userId });
    const quizzesCount = quizzes.length;

    // Quiz Attempts
    const quizAttempts = await QuizAttempt.find({ user: userId });

    // Recent Activity logs
    const logs = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = logs.map((log) => ({
      name: user.name,
      action: log.action,
      time: timeAgo(log.createdAt),
    }));

    const quote = await generateQuoteOfTheDay();

    res.json({
      user: {
        name: user.name,
        streak: user.streak,
      },
      stats: {
        notes: notesCount,
        summaries: summariesCount,
        flashcards: flashcardsCount,
        quizzes: quizzesCount,
      },
      quote,
      activities,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};
