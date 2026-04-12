const Application = require("../models/Application");
const Job = require("../models/Job");

// APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID required" });
    }

    // Prevent duplicate apply
    const alreadyApplied = await Application.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    const application = await Application.create({
      user: req.user._id, // ✅ VERY IMPORTANT
      job: jobId,
      resume: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    res.status(201).json(application);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      user: req.user._id, // ✅ FILTER
    }).populate("job");

    res.json(apps);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET ALL
exports.getApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("user", "name email skills education about rollNo")
    .populate("job", "title company");

  res.json(apps);
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// COMPANY: GET APPLICATIONS FOR MY JOBS
exports.getCompanyApplications = async (req, res) => {
    try {
      // 1. Find all jobs posted by this company
      const myJobs = await Job.find({ postedBy: req.user._id });
      const myJobIds = myJobs.map(job => job._id);
  
      // 2. Find applications for those jobs
      const apps = await Application.find({
        job: { $in: myJobIds }
      })
      .populate("user", "name email role rollNo studentClass semester skills about education projects")
      .populate("job", "title company location");
  
      res.json(apps);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };