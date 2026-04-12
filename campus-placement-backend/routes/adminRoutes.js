const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  adminLogin,
  getAllStudents,
  getAllCompanies,
  getAnalytics, // 🔥 NEW
} = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 🔐 Login
router.post("/login", adminLogin);

// 🔐 Protected Admin Routes
router.get("/pending", protect, authorizeRoles("admin"), getPendingUsers);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveUser);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectUser);
router.get("/students", protect, authorizeRoles("admin"), getAllStudents);
router.get("/companies", protect, authorizeRoles("admin"), getAllCompanies);

// 🔥 ANALYTICS
router.get("/analytics", protect, authorizeRoles("admin"), getAnalytics);

module.exports = router;