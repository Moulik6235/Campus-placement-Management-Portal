const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Job = require("../models/Job");

exports.analyzeJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user._id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "AI Features not configured (API Key missing)" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the lite model which is verified to have quota in this environment
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      You are an expert technical recruiter. Analyze this student's profile against the job description.
      
      STUDENT PROFILE:
      - Name: ${user.name}
      - Skills: ${user.skills?.join(", ") || "None listed"}
      - Education: ${JSON.stringify(user.education || [])}
      - About: ${user.about || "No bio provided"}

      JOB DETAILS:
      - Title: ${job.title}
      - Company: ${job.company}
      - Description: ${job.description}
      - Required Skills: ${job.skillsRequired?.join(", ") || "None listed"}

      IMPORTANT: Return ONLY a valid JSON object. Do not include any markdown formatting, code blocks, or explanations.
      
      Structure:
      {
        "score": number (0-100),
        "matchedSkills": ["skill1", "skill2"],
        "missingSkills": ["skill3", "skill4"],
        "recommendations": ["tip1", "tip2", "tip3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const output = JSON.parse(text);

    res.json(output);
  } catch (err) {
    console.error("AI Match Error:", err);
    res.status(500).json({ 
      message: "Error analyzing match", 
      error: err.message,
      tip: "Ensure your Gemini API Key is valid and has access to the flash model."
    });
  }
};
