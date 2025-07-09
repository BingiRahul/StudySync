const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// import all route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const progressRoutes = require("./routes/progressRoutes");
const profileRoutes = require("./routes/profileRoutes");

const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Public Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", progressRoutes);
app.use("/api/profile", profileRoutes);

// ✅ Protect quizzes routes
app.use("/api/quizzes", authMiddleware, quizRoutes);

// Optional health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
