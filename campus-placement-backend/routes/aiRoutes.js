const express = require("express");
const router = express.Router();
const { analyzeJobMatch, chatBotResponse } = require("../controllers/aiController");
const { protect, authorizeRoles, optionalProtect } = require("../middleware/authMiddleware");

router.post("/match-score", protect, authorizeRoles("student"), analyzeJobMatch);
router.post("/chat", optionalProtect, chatBotResponse);

module.exports = router;
