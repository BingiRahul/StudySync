const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the working Gemini Flash model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

// This generates a single summary string
async function generateSummary(text) {
  try {
    const result = await model.generateContent(
      `Summarize this text:\n\n${text}`
    );

    const response = result.response;
    const summary = response.text();

    console.log("✅ Gemini Flash summary generated:", summary);
    return summary;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Error generating summary.";
  }
}

module.exports = { generateSummary };
