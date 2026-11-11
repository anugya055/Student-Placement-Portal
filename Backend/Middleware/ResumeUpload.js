
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "applications"
);

// Create the upload directory if it does not exist
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const safeName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error("Only PDF, DOC, and DOCX resumes are allowed.")
    );
  }

  cb(null, true);
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum
    files: 1,
  },
});

module.exports = uploadResume;
