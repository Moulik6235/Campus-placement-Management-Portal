const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, registrationTemplate } = require("../services/emailService");

//  Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//  REGISTER USER (Student or Company)
exports.registerUser = async (req, res) => {
  const { name, email, password, rollNo, studentClass, semester, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    const finalRole = (role === "company" || role === "student") ? role : "student";

    // Create user with pending status
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      status: "pending",
    };

    // Only add student fields if role is student
    if (finalRole === "student") {
      userData.rollNo = rollNo;
      userData.studentClass = studentClass;
      userData.semester = semester;
    }

    const user = await User.create(userData);

    // Send Registration Email
    await sendEmail(
      user.email,
      "Registration Received - GCCBA Placement Portal",
      registrationTemplate(user.name)
    );

    res.status(201).json({
      message: "Registration successful. Wait for admin approval.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//  LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check user and password
    if (user && (await bcrypt.compare(password, user.password))) {

      //  If rejected
      if (user.status === "rejected") {
        return res.status(403).json({
          message: "Your account has been rejected by admin",
        });
      }

      //  If pending
      if (user.status === "pending") {
        return res.status(403).json({
          message: "Your account is not approved yet",
        });
      }

      // Approved → allow login
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });

    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};