const express = require("express");
const router = express.Router();
const { analyzeJobMatch } = require("../controllers/aiController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/match-score", protect, authorizeRoles("student"), analyzeJobMatch);

module.exports = router;
