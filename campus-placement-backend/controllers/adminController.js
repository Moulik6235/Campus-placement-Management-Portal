const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, approvalTemplate } = require("../services/emailService");

// 🔐 Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists AND is admin
    if (!user || user.role !== "admin") {
      return res.status(401).json({
        message: "Not an admin",
      });
    }

    // Check password
    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid password",
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending users
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Approve user
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "approved";
    await user.save();

    // Send Approval Email
    await sendEmail(
      user.email,
      "Account Approved - GCCBA Placement Portal",
      approvalTemplate(user.name)
    );

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Reject user
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "rejected";
    await user.save();

    res.json({ message: "User rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL COMPANIES
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" }).sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Application = require("../models/Application");
const Job = require("../models/Job");

// 📊 ADMIN ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const User = require("../models/User");
    const Job = require("../models/Job");
    const Application = require("../models/Application");

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const successRate = totalApplications
      ? Math.round((totalApplications / totalStudents) * 100)
      : 0;

    res.json({
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      successRate,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};