const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateQuestionsFromNote = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
  });

  const prompt = `
Generate 5-10 multiple choice questions from the following note content.

Each question should have:
- "text": the question text
- "options": an array of 4 options
- "correctAnswer": one of the options

**Output only the JSON array.** No explanation, no markdown.

Example:
[
  {
    "text": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "B"
  }
]

Note content:
${noteContent}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const raw = response.text();

    if (!raw || raw.trim() === "") {
      console.error("Gemini returned empty response.");
      throw new Error("Gemini returned empty response.");
    }

    // Remove any Markdown code block markers:
    let text = raw.replace(/```json|```/g, "").trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) {
      console.error("No JSON brackets found in Gemini response:", text);
      throw new Error("Failed to extract JSON from Gemini response.");
    }

    const json = text.substring(start, end);
    const questions = JSON.parse(json);

    console.log(`Gemini returned ${questions.length} questions.`);

    return questions;
  } catch (error) {
    console.error("Gemini error or invalid JSON:", error.message);
    throw new Error("Failed to generate quiz questions from note.");
  }
};
