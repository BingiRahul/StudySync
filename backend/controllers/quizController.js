const { QuizTopic, Quiz, QuizAttempt } = require("../models/quiz");
const { generateQuestionsFromNote } = require("../utils/questionGenerator");

exports.generateQuizFromNote = async (req, res) => {
  try {
    const userId = req.user.id;

    const noteContent = req.body.content;

    if (!noteContent || noteContent.trim() === "") {
      return res.status(400).json({
        message: "Note content is empty. Cannot generate quiz.",
      });
    }

    const questions = await generateQuestionsFromNote(noteContent);

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "AI did not return any quiz questions.",
      });
    }

    let topic = await QuizTopic.findOne({
      title: req.body.title,
      subject: req.body.subject,
      user: userId,
    });

    if (!topic) {
      topic = await QuizTopic.create({
        title: req.body.title,
        subject: req.body.subject,
        tags: req.body.tags || [],
        user: userId,
      });
    }

    const quiz = await Quiz.create({
      title: req.body.title,
      topic: topic._id,
      questions,
      estimatedTime: questions.length,
      user: userId,
    });

    topic.quizCount += 1;
    await topic.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating quiz" });
  }
};


exports.createQuizQuestion = async (req, res) => {
  try {
    const { title, subject, tags, question, options, correctAnswer } = req.body;
    const userId = req.user.id;

    let topic = await QuizTopic.findOne({
      title,
      subject,
      user: userId,
    });

    if (!topic) {
      topic = await QuizTopic.create({
        title,
        subject,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        user: userId,
      });
    }

    const quiz = await Quiz.create({
      title,
      topic: topic._id,
      questions: [
        {
          text: question,
          options,
          correctAnswer,
        },
      ],
      estimatedTime: 1,
      user: userId,
    });

    topic.quizCount += 1;
    await topic.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quiz question" });
  }
};

exports.getQuizTopics = async (req, res) => {
  try {
    const userId = req.user.id;
    const topics = await QuizTopic.find({ user: userId });
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching topics" });
  }
};

exports.getQuizzesByTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = req.params.topicId;

    const topic = await QuizTopic.findOne({ _id: topicId, user: userId });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const quizzes = await Quiz.find({ topic: topicId, user: userId });

    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const userId = req.user.id;
    const quiz = await Quiz.findOne({ _id: req.params.quizId, user: userId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

exports.recordQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const quiz = await Quiz.findOne({ _id: req.params.quizId, user: userId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      user: userId,
      score: req.body.score,
    });

    quiz.lastScore = req.body.score;
    await quiz.save();

    const attempts = await QuizAttempt.find({ quiz: quiz._id });
    const avg = attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length;

    await QuizTopic.findByIdAndUpdate(quiz.topic, { averageScore: avg });

    res.status(201).json(attempt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recording quiz attempt" });
  }
};

exports.getAttemptsByQuizId = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await QuizAttempt.find({
      quiz: req.params.quizId,
      user: userId,
    });

    res.json(attempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attempts" });
  }
};
