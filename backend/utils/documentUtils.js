const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const data = await pdfParse(fs.readFileSync(filePath));
      return data.text.trim();
    }

    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf-8").trim();
    }

    if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    }

    console.warn("Unsupported file extension:", ext);
    return "";
  } catch (error) {
    console.error("Error extracting text from document:", error);
    return "";
  }
}

module.exports = { extractTextFromDocument };
