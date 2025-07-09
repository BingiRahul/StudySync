const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

async function testGeminiModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTest = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      "gemini-1.0-pro",
      "gemini-pro",
    ];

    const testPrompt = "What is the capital of Germany?";

    for (const modelName of modelsToTest) {
      console.log(`\n🚀 Testing model: ${modelName}`);

      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(testPrompt);
        const response = result.response;
        console.log(`✅ Model "${modelName}" succeeded:\n${response.text()}`);

        process.exit(0); // Exit on first success
      } catch (err) {
        console.error(`❌ Model "${modelName}" failed:\n`, err.message);
      }
    }

    console.error("\n❌ All models failed.");
    process.exit(1);
  } catch (err) {
    console.error("❌ Gemini initialization error:\n", err);
    process.exit(1);
  }
}

testGeminiModels();
