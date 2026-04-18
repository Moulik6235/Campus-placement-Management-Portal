const sendEmail = require("../utils/sendEmail");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

 

    const message = `
      Hello!
      
      Thank you for subscribing to the GCCBA Placement Portal newsletter.
      You will now receive weekly job alerts and career tips directly in your inbox.
      
      Best Regards,
      GCCBA Placement Cell
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #dd1477;">Welcome to GCCBA Placement Portal!</h2>
        <p>Dear Student/User,</p>
        <p>Thank you for subscribing to our newsletter. You're now on the list to receive the latest job opportunities, internship alerts, and career guidance tips.</p>
        <p>We're excited to help you in your professional journey!</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>GCCBA Placement Cell</strong></p>
        <p style="font-size: 0.8em; color: #777;">Government College of Commerce and Business Administration, Chandigarh</p>
      </div>
    `;

    try {
      await sendEmail({
        email: email,
        subject: "Newsletter Subscription Confirmed - GCCBA Placement Portal",
        message,
        html,
      });

      res.status(200).json({ message: "Subscription successful! Check your email for confirmation." });
    } catch (mailErr) {
      console.error("Mail Send Error:", mailErr);
      res.status(500).json({ message: "Could not send confirmation email. Please check your SMTP settings." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
