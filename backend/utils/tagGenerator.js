/**
 * generateTags
 * @param {string} text - text from which to generate tags
 * @param {string} query - user instructions for tag generation (currently unused, but kept for future AI logic)
 * @returns {string[]} tags
 */
function generateTags(text, query) {
  if (!text || !text.trim()) {
    console.log("generateTags → Empty text received. Returning default tags.");
    return ["untagged"];
  }

  // Simple keyword extraction:
  const words = text
    .split(/\W+/)
    .filter((w) => w.length > 4)
    .map((w) => w.toLowerCase());

  // Take top 3 unique words
  const unique = Array.from(new Set(words));
  const tags = unique.slice(0, 3);

  if (tags.length > 0) {
    console.log("generateTags → generated tags:", tags);
    return tags;
  } else {
    console.log("generateTags → No meaningful words found. Returning fallback tags.");
    return ["general", "document"];
  }
}

module.exports = { generateTags };
