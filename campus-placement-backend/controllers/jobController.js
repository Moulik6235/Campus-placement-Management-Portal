const Job = require("../models/Job");
const User = require("../models/User");
const { sendEmail, newJobTemplate } = require("../services/emailService");

//  Create Job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description, jobType, skillsRequired, experienceRequired } = req.body;

    if (!title || !location || !description || !jobType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let skillsArray = [];
    if (typeof skillsRequired === 'string') {
        skillsArray = skillsRequired.split(',').map(s => s.trim()).filter(s => s);
    } else if (Array.isArray(skillsRequired)) {
        skillsArray = skillsRequired;
    }

    const job = await Job.create({
      title,
      company: company || req.user.name,
      location,
      salary,
      description,
      jobType,
      experienceRequired,
      skillsRequired: skillsArray,
      postedBy: req.user._id //Connect job to the company user
    });

    // Notify all approved students
    const approvedStudents = await User.find({ role: "student", status: "approved" });
    
    // Using Promise.all to send emails concurrently
    if (approvedStudents.length > 0) {
      const emailPromises = approvedStudents.map(student => 
        sendEmail(
          student.email, 
          `New Job Opportunity: ${job.title} at ${job.company}`, 
          newJobTemplate(job.title, job.company, job.location)
        )
      );
      await Promise.all(emailPromises);
    }

    res.status(201).json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//  Get My Jobs (for Company)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle skills string to array conversion
    if (data.skillsRequired && typeof data.skillsRequired === 'string') {
        data.skillsRequired = data.skillsRequired.split(',').map(s => s.trim()).filter(s => s);
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  AI RECOMMENDATION
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const jobs = await Job.find();
    const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());

    const recommended = jobs.map((job) => {
      let score = 0;
      let matchedSkills = [];

      // Match skills
      if (job.skillsRequired && job.skillsRequired.length > 0) {
        job.skillsRequired.forEach((skill) => {
          if (userSkills.includes(skill.toLowerCase().trim())) {
            score += 2;
            matchedSkills.push(skill);
          }
        });
      }

      // Match job type
      if (job.jobType && user.preferredJobType && job.jobType.toLowerCase() === user.preferredJobType.toLowerCase()) {
        score += 2;
      }

      // Match location
      if (job.location && user.preferredLocation && job.location.toLowerCase().includes(user.preferredLocation.toLowerCase())) {
        score += 1;
      }

      return { ...job._doc, score, matchedSkills };
    });

    // Sort by score
    recommended.sort((a, b) => b.score - a.score);

    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};