const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"GCCBA Placement Cell" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};


const registrationTemplate = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #dd1477;">GCCBA Placement Portal</h2>
  </div>
  <p>Dear <strong>${name}</strong>,</p>
  <p>Thank you for registering on the GCCBA Placement Portal!</p>
  <p>Your account is currently <strong>under review</strong> by the administration. This process usually takes 24-48 hours.</p>
  <p>Once your account is approved, you will receive another email and will be able to sign in and apply for jobs.</p>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

const approvalTemplate = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #28a745;">Registration Approved!</h2>
  </div>
  <p>Dear <strong>${name}</strong>,</p>
  <p>Congratulations! Your account on the GCCBA Placement Portal has been <strong>approved</strong>.</p>
  <p>You can now sign in using your registered email and password to explore and apply for job opportunities.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #dd1477; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign In Now</a>
  </div>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

const newJobTemplate = (jobTitle, company, location) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #dd1477;">New Job Opportunity</h2>
  </div>
  <p>A new job has been posted that might interest you:</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #dd1477; margin: 20px 0;">
    <h3 style="margin: 0; color: #333;">${jobTitle}</h3>
    <p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${company}</p>
    <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${location}</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/jobs" style="background-color: #dd1477; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Job Details</a>
  </div>
  <p>Don't miss out on this opportunity!</p>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

const applicationReceivedTemplate = (name, jobTitle, company) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #dd1477;">Application Received</h2>
  </div>
  <p>Dear <strong>${name}</strong>,</p>
  <p>You have successfully applied for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
  <p>We will notify you of any status updates regarding your application.</p>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

const shortlistTemplate = (name, jobTitle, company) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #28a745;">Congratulations! You are Shortlisted</h2>
  </div>
  <p>Dear <strong>${name}</strong>,</p>
  <p>We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> has been <strong>shortlisted</strong>!</p>
  <p>You will shortly be called for an interview round. Please keep an eye on your email and portal messages for further instructions and details regarding the interview schedule.</p>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

const rejectionTemplate = (name, jobTitle, company) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #6c757d;">Application Update</h2>
  </div>
  <p>Dear <strong>${name}</strong>,</p>
  <p>Thank you for your interest and applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
  <p>We regret to inform you that your profile was not selected to move forward for this particular role at this time.</p>
  <p>We encourage you to continue applying for other exciting opportunities on our portal.</p>
  <p>Best regards,<br/>GCCBA Placement Cell</p>
</div>
`;

module.exports = {
  sendEmail,
  registrationTemplate,
  approvalTemplate,
  newJobTemplate,
  applicationReceivedTemplate,
  shortlistTemplate,
  rejectionTemplate,
};
