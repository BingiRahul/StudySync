const mongoose = require("mongoose"); 

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    document: { type: String },
    images: [{ type: String }],
    aiSummary: [{ type: String }],
    aiQuestions: [{ type: String }],
    aiTags: [{ type: String }], // ✅ add this
    downloads: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
