const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");

const {
  applyJob,
  getApplications,
  updateStatus,
  getMyApplications,
  getCompanyApplications,
} = require("../controllers/applicationController");

// multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/apply", protect, upload.single("resume"), applyJob);
router.get("/", getApplications);
router.put("/:id", updateStatus);
router.get("/my", protect, getMyApplications);
router.get("/company", protect, getCompanyApplications);

module.exports = router;