require("dotenv").config();
const Note = require("../models/note");
const { generateSummary } = require("../utils/summary");
const path = require("path");
const fs = require("fs");
const { sanitizeFolderName } = require("../middleware/uploadMiddleware");
const { extractTextFromDocument } = require("../utils/documentUtils");
const { generateTags } = require("../utils/tagGenerator"); // ✅ new import
const Flashcard = require("../models/flashcard");

exports.createNote = async (req, res) => {
  try {
    console.log("req.body →", req.body);
    console.log("req.files →", req.files);

    const { title, subject, description } = req.body;

    if (!title || !subject) {
      return res
        .status(400)
        .json({ message: "Title and subject are required." });
    }

    const note = new Note({
      title,
      subject,
      description,
      userId: req.user.id,
    });

    const folderName = sanitizeFolderName(note.title);

    let documentPath = null;
    if (req.files && req.files.document && req.files.document.length > 0) {
      documentPath = `/uploads/${folderName}/${req.files.document[0].filename}`;
    }

    let imagesPaths = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      imagesPaths = req.files.images.map(
        (file) => `/uploads/${folderName}/${file.filename}`
      );
    }

    note.document = documentPath;
    note.images = imagesPaths;

    let combinedText = "";

    if (documentPath) {
      const absolutePath = path.join(
        __dirname,
        "..",
        "..",
        documentPath
      );
      console.log("Reading document from:", absolutePath);

      try {
        const extractedText = await extractTextFromDocument(absolutePath);
        console.log("Extracted text length:", extractedText.length);
        combinedText += extractedText;
      } catch (err) {
        console.error("Error extracting text from document:", err);
      }
    }

    if (description && description.trim().length > 0) {
      combinedText += `\n${description}`;
    }

    if (combinedText.trim().length > 0) {
      const chunkSize = 2000;
      const summaryChunks = [];

      for (let i = 0; i < combinedText.length; i += chunkSize) {
        const chunk = combinedText.slice(i, i + chunkSize);

        try {
          const chunkSummary = await generateSummary(chunk);
          summaryChunks.push(chunkSummary);
        } catch (err) {
          console.error("Gemini error:", err.message || err);
          summaryChunks.push(
            "Summary unavailable for this chunk due to an error."
          );
        }
      }

      note.aiSummary = summaryChunks;

      const tags = generateTags(combinedText);
      note.aiTags = tags;
    } else {
      note.aiSummary = [
        "No description or document provided for summarization.",
      ];
      note.aiTags = [];
    }

    await note.save();

    // ✅ NEW: generate flashcards automatically
    if (note.aiSummary && note.aiSummary.length > 0) {
      const flashcards = [];

      for (let i = 0; i < note.aiSummary.length; i++) {
        const summary = note.aiSummary[i];
        const question = `What is covered in summary section ${i + 1}?`;

        flashcards.push({
          front: question,
          back: summary,
          known: false,
          difficult: false,
        });
      }

      await Flashcard.create({
        title: note.title,
        subject: note.subject,
        tags: note.aiTags || [],
        cards: flashcards,
        noteId: note._id,
        userId: note.userId,
      });

      console.log("Flashcards generated and saved!");
    }

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete files
    const folder = path.join(
      __dirname,
      "..",
      "uploads",
      sanitizeFolderName(note.title)
    );
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.regenerateSummary = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    let combinedText = "";

    // ✅ Prefer text sent from frontend if available
    if (req.body.textToSummarize && req.body.textToSummarize.trim().length > 0) {
      combinedText = req.body.textToSummarize;
    } else {
      // Otherwise try reading from note fields
      if (note.document) {
        const absolutePath = path.join(
          __dirname,
          "..",
          "..",
          note.document
        );

        if (fs.existsSync(absolutePath)) {
          try {
            const docText = await extractTextFromDocument(absolutePath);
            combinedText += docText;
          } catch (err) {
            console.error("Error extracting text from document:", err.message);
          }
        }
      }

      if (note.description) {
        combinedText += `\n${note.description}`;
      }
      if (note.noteText) {
        combinedText += `\n${note.noteText}`;
      }
    }

    if (!combinedText.trim()) {
      return res
        .status(400)
        .json({ message: "No text available to generate summary." });
    }

    const userQuery = req.body.instructions || "";

    const chunkSize = 2000;
    const summaryChunks = [];

    for (let i = 0; i < combinedText.length; i += chunkSize) {
      const chunk = combinedText.slice(i, i + chunkSize);

      const chunkSummary = await generateSummary(chunk, userQuery);
      summaryChunks.push(chunkSummary);
    }

    note.aiSummary = summaryChunks;
    await note.save();

    res.json({ aiSummary: note.aiSummary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.regenerateTags = async (req, res) => {
  try {
    console.log("REGENERATE TAGS hit!");
    console.log("req.body →", req.body);

    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Note not found" });
    }

    const combinedText =
      req.body.textToSummarize?.trim() ||
      note.noteText?.trim() ||
      note.description?.trim() ||
      "";

    console.log("combinedText length →", combinedText.length);

    const userQuery = req.body.instructions || "";
    console.log("userQuery →", userQuery);

    const tags = generateTags(combinedText, userQuery);
    console.log("Generated tags →", tags);

    note.aiTags = tags;
    await note.save();

    res.json({ aiTags: tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
