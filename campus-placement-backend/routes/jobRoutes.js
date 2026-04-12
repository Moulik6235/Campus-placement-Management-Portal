const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
  getRecommendedJobs,
  getMyJobs,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/my", protect, getMyJobs);
router.get("/recommended", protect, getRecommendedJobs);
router.delete("/:id", protect, deleteJob);
router.put("/:id", protect, updateJob);

module.exports = router;