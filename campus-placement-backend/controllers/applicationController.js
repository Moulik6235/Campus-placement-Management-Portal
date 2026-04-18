const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendEmail, applicationReceivedTemplate, shortlistTemplate, rejectionTemplate } = require("../services/emailService");

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
      user: req.user._id,
      job: jobId,
      resume: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    try {
      const jobDetails = await Job.findById(jobId);
      const emailHtml = applicationReceivedTemplate(req.user.name, jobDetails.title, jobDetails.company);
      await sendEmail(
        req.user.email,
        `Application Received - ${jobDetails.title}`,
        emailHtml
      );
    } catch (emailErr) {
      console.log("Email not sent:", emailErr);
    }

    res.status(201).json(application);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// GET APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      user: req.user._id,
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

    const app = await Application.findById(req.params.id)
      .populate("user", "name email")
      .populate("job", "title company");

    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = status;
    await app.save();

    let emailSubject = "";
    let emailHtml = "";

    if (status === "Shortlisted") {
      emailSubject = `Congratulations! You are Shortlisted for ${app.job.title}`;
      emailHtml = shortlistTemplate(app.user.name, app.job.title, app.job.company);
    } else if (status === "Rejected") {
      emailSubject = `Application Status Update - ${app.job.title}`;
      emailHtml = rejectionTemplate(app.user.name, app.job.title, app.job.company);
    }

    if (emailSubject && emailHtml) {
      try {
        await sendEmail(app.user.email, emailSubject, emailHtml);
      } catch (err) {
        console.log("Status update email error: ", err);
      }
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// COMPANY: GET APPLICATIONS FOR MY JOBS
exports.getCompanyApplications = async (req, res) => {
    try {
     
      const myJobs = await Job.find({ postedBy: req.user._id });
      const myJobIds = myJobs.map(job => job._id);
  
     
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