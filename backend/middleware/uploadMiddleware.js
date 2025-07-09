// backend/middleware/uploadMiddleware.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Utility to clean up folder names
function sanitizeFolderName(title) {
  return title
    .replace(/[\/\\:*?"<>|]/g, "") // remove unsafe chars
    .replace(/\s+/g, "_")
    .trim();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const title = req.body.title || "Untitled_Note";
    const folderName = sanitizeFolderName(title);

    // ✅ Updated path to save in top-level uploads folder
    const uploadPath = path.join(__dirname, "../../uploads", folderName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let filename = "";

    if (file.fieldname === "document") {
      filename = "document1" + ext;
    } else if (file.fieldname === "images") {
      if (!req.imageCounter) req.imageCounter = 1;
      filename = `image${req.imageCounter}${ext}`;
      req.imageCounter += 1;
    }

    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = { upload, sanitizeFolderName };
