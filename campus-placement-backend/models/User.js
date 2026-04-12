const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
    },
    studentClass: {
      type: String,
    },
    semester: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    skills: [String],

    preferredJobType: {
      type: String,
      enum: ["Full-time", "Internship", "Remote", "Part-time"],
    },

    preferredLocation: String,
    
    about: String,
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      }
    ],
    projects: [
      {
        title: String,
        link: String,
        description: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);