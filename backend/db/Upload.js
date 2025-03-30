const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the folder exists
const uploadDir = "data/phonephoto";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Upload function (supports multiple files)
const upload = multer({ storage });

module.exports = upload;
