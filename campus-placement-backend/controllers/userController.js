const User = require("../models/User");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { skills, preferredJobType, preferredLocation, about, education, projects } = req.body;

    const updates = {};
    const allowedFields = ["skills", "preferredJobType", "preferredLocation", "about", "education", "projects"];
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: false }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//  Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.resume = req.file.path;

    await user.save();

    res.json({ message: "Resume uploaded successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get Profile (IMPORTANT)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};