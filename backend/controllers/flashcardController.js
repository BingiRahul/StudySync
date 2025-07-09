// backend/controllers/flashcardController.js

const Flashcard = require("../models/flashcard");

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(flashcards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching flashcards" });
  }
};

exports.updateFlashcardCard = async (req, res) => {
  try {
    const { topicId, cardId } = req.params;
    const updates = req.body;

    // Find the flashcard topic
    const flashcardTopic = await Flashcard.findOne({
      _id: topicId,
      userId: req.user.id,
    });

    if (!flashcardTopic) {
      return res.status(404).json({ message: "Flashcard topic not found" });
    }

    // Find the card inside the topic
    const card = flashcardTopic.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Apply updates
    Object.assign(card, updates);

    await flashcardTopic.save();

    res.json({ message: "Card updated", card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating card" });
  }
};
