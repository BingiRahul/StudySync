const Note = require("../models/note");
const Flashcard = require("../models/flashcard");
const { Quiz, QuizTopic, QuizAttempt } = require("../models/quiz");

/**
 * Returns a week label like "Week 27" for a given date.
 */
function getWeekLabel(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24));
  return `Week ${Math.floor(days / 7) + 1}`;
}

/**
 * Calculates the longest streak of consecutive days with activity.
 */
function calculateBestStreak(dateStrings) {
  const uniqueDates = [...new Set(dateStrings)].sort();
  let streak = 1;
  let bestStreak = 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      if (streak > bestStreak) bestStreak = streak;
    } else {
      streak = 1;
    }
  }

  return bestStreak;
}

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // ───────────────────────────────
    // Quiz Performance Over Time
    // ───────────────────────────────

    const attempts = await QuizAttempt.find({ user: userId }).populate("quiz");

    const scoresPerWeek = {};

    for (const attempt of attempts) {
      const weekLabel = getWeekLabel(attempt.createdAt);
      if (!scoresPerWeek[weekLabel]) scoresPerWeek[weekLabel] = [];
      scoresPerWeek[weekLabel].push(attempt.score);
    }

    const quizPerformance = {
      labels: [],
      scores: [],
      average: 0,
    };

    for (const [week, scores] of Object.entries(scoresPerWeek)) {
      quizPerformance.labels.push(week);
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      quizPerformance.scores.push(parseFloat(avg.toFixed(2)));
    }

    quizPerformance.average =
      quizPerformance.scores.length > 0
        ? (
            quizPerformance.scores.reduce((sum, s) => sum + s, 0) /
            quizPerformance.scores.length
          ).toFixed(1)
        : 0;

    // ───────────────────────────────
    // Study Streak Data
    // ───────────────────────────────

    const noteDates = (
      await Note.find({ userId }).select("createdAt")
    ).map((n) => n.createdAt.toISOString().substring(0, 10));

    const flashcardDates = (
      await Flashcard.find({ userId }).select("updatedAt")
    ).map((f) => f.updatedAt.toISOString().substring(0, 10));

    const quizDates = attempts.map((a) =>
      a.createdAt.toISOString().substring(0, 10)
    );

    const allActivityDates = [
      ...noteDates,
      ...flashcardDates,
      ...quizDates,
    ];

    const bestStreak = calculateBestStreak(allActivityDates);

    const studyStreak = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      studied: [0, 0, 0, 0, 0, 0, 0],
      bestStreak,
    };

    allActivityDates.forEach((dateStr) => {
      const dayIndex = new Date(dateStr).getDay(); // 0=Sunday
      const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      studyStreak.studied[mappedIndex] = 1;
    });

    // ───────────────────────────────
    // Time Spent Data
    // ───────────────────────────────

    const noteCount = await Note.countDocuments({ userId });
    const flashcardCount = await Flashcard.countDocuments({ userId });
    const quizCount = await Quiz.countDocuments({ user: userId });

    const timeSpent = {
      labels: ["Notes Created", "Flashcards Reviewed", "Quizzes Taken"],
      hours: [
        noteCount * 0.5,         // assume ~30 min per note
        flashcardCount * 0.2,    // assume ~12 min per flashcard session
        quizCount * 0.3,         // assume ~18 min per quiz
      ],
      totalHours:
        noteCount * 0.5 +
        flashcardCount * 0.2 +
        quizCount * 0.3,
    };

    // ───────────────────────────────
    // Subject Performance Data
    // ───────────────────────────────

    // Aggregate subject performance from notes, flashcards, and quiz topics
    const subjectsMap = {};

    // From Notes
    const userNotes = await Note.find({ userId });
    userNotes.forEach((note) => {
      if (!subjectsMap[note.subject]) {
        subjectsMap[note.subject] = {
          name: note.subject,
          avgScore: 0,
          notes: 0,
          timeSpent: 0,
          trend: "improving",
        };
      }
      subjectsMap[note.subject].notes += 1;
      subjectsMap[note.subject].timeSpent += 0.5;
    });

    // From Flashcards
    const userFlashcards = await Flashcard.find({ userId });
    userFlashcards.forEach((fc) => {
      if (!subjectsMap[fc.subject]) {
        subjectsMap[fc.subject] = {
          name: fc.subject,
          avgScore: 0,
          notes: 0,
          timeSpent: 0,
          trend: "improving",
        };
      }
      subjectsMap[fc.subject].timeSpent += 0.2;
    });

    // From Quiz Topics
    const quizTopics = await QuizTopic.find({ user: userId });
    quizTopics.forEach((topic) => {
      if (!subjectsMap[topic.subject]) {
        subjectsMap[topic.subject] = {
          name: topic.subject,
          avgScore: 0,
          notes: 0,
          timeSpent: 0,
          trend: "improving",
        };
      }
      subjectsMap[topic.subject].avgScore = topic.averageScore || 0;
      subjectsMap[topic.subject].timeSpent += topic.quizCount * 0.3;
      subjectsMap[topic.subject].trend =
        topic.averageScore > 70 ? "improving" : "declining";
    });

    const subjects = Object.values(subjectsMap);

    // ───────────────────────────────
    // Insights (simple generated)
    // ───────────────────────────────

    const insights = [];

    subjects.forEach((subj) => {
      if (subj.trend === "declining") {
        insights.push({
          text: `${subj.name} performance has declined recently. Consider revising notes or quizzes.`,
          priority: "high",
        });
      } else {
        insights.push({
          text: `Great job! Your ${subj.name} progress looks strong.`,
          priority: "low",
        });
      }
    });

    res.json({
      quizPerformance,
      studyStreak,
      timeSpent,
      subjects,
      insights,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching progress data." });
  }
};
