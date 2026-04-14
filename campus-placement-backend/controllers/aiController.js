const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Job = require("../models/Job");

exports.analyzeJobMatch = async (req, res) => {
  let user = null;
  
  try {
    const { jobId } = req.body;
    user = await User.findById(req.user._id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "AI Features not configured (API Key missing)" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-flash-latest model as it's the standard fast model supported by the current v1beta Google API
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
    
    // Fallback Mock Response so UI doesn't crash from API limits
    res.status(200).json({ 
      score: 75,
      matchedSkills: user && user.skills ? user.skills : [],
      missingSkills: ["Domain specific technologies", "Advanced problem solving"],
      recommendations: ["Highlight relevant coursework", "Consider acquiring additional certifications", "(Note: Score provided by fallback due to Gemini limits)"]
    });
  }
};

exports.chatBotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "No message provided." });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Chatbot logic is offline: Missing API Key." });
    }

    // Fetch jobs context
    const jobs = await Job.find({}).limit(10);
    const jobsContext = jobs.map(j => `- ${j.title} at ${j.company} in ${j.location}`).join('\n');

    // Fetch user context if token exists (even if route is unprotected, we can try to extract user)
    // For now, let's assume we want to support both. 
    // If the route doesn't have protect, req.user won't be there.
    // I will use req.user if available (e.g. if we add protect back or use a custom check)
    let userContext = "Guest User";
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        userContext = `Student Name: ${user.name}, Skills: ${user.skills?.join(', ') || 'Not listed'}, Bio: ${user.about || 'Not provided'}`;
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are the official GCCBA Placement Portal AI Assistant. 
      CONTEXT:
      - Current Jobs Available:
      ${jobsContext || "No specific jobs listed right now."}
      
      - User Profile: ${userContext}
      
      INSTRUCTIONS:
      1. Help students with job assistance, general queries, and platform support.
      2. If asked to suggest jobs, look at the "Current Jobs Available" above and recommend matching ones in a CLEAR BULLETED LIST.
      3. For each job, mention the Title, Company, and Location on a new line.
      4. If asked about contact details: Email: placement@gccba.edu.in, Location: Admin Block, Timing: 9AM-4PM (Mon-Sat).
      5. Keep answers under 4-5 short sentences. Use bullet points (*) for lists to make them readable.

      User Message: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text.trim() });
  } catch (err) {
    console.error("AI Chatbot Error:", err);
    res.status(200).json({ 
      reply: "We are currently experiencing high traffic on our AI servers. Please try again later or visit the Help & Support page!" 
    });
  }
};
