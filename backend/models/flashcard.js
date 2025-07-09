const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    tags: [String],
    cards: [
      {
        front: { type: String, required: true },
        back: { type: String, required: true },
        known: { type: Boolean, default: false },
        difficult: { type: Boolean, default: false },
      },
    ],
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
