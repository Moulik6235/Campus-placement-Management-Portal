const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  updateProfile,
  uploadResume,
  getProfile,   // ✅ ADD THIS
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// 📄 Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Routes
router.get("/profile", protect, getProfile);   // ✅ ADD THIS
router.put("/profile", protect, updateProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;