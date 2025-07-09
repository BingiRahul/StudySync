const { GoogleGenerativeAI } = require("@google/generative-ai");

// Init Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Clean possible markdown fences (e.g. ```json ... ```) from Gemini responses
 */
function cleanGeminiResponse(rawText) {
  let text = rawText.trim();

  if (text.startsWith("```")) {
    text = text.replace(/```[a-zA-Z]*\n?/, ""); // remove opening ```json or ```
    text = text.replace(/```$/, "");           // remove closing ```
  }

  return text.trim();
}

async function generateQuoteOfTheDay() {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  const prompt = `
    Generate a single inspirational "quote of the day" that is:

    - Originally said or written by a real and reputed author, philosopher, scientist, leader, or public figure (e.g., Albert Einstein, Maya Angelou, Nelson Mandela).
    - Accurate and verifiable.
    - No fictional characters or anonymous sources.

    Return the quote strictly in the following JSON format without any extra text, markdown, or explanation:

    {
      "text": "The quote goes here.",
      "author": "Full name of the real-world author"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean possible markdown fences
    responseText = cleanGeminiResponse(responseText);

    const quote = JSON.parse(responseText);

    return quote;
  } catch (e) {
    console.error("Failed to parse quote from Gemini:", e);

    // Return a fallback quote
    return {
      text: "Keep learning, keep growing.",
      author: "AI Assistant",
    };
  }
}

module.exports = {
  generateQuoteOfTheDay,
};
