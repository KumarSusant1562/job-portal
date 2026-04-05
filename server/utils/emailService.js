const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email template for job application
const getApplicationEmailTemplate = (jobTitle, companyName, applicantName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #0a66c2 0%, #00a4ef 100%); color: white; padding: 30px; border-radius: 8px; text-align: center;">
        <h1 style="margin: 0;">Application Submitted Successfully! 🎉</h1>
      </div>

      <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333;">Hi ${applicantName},</p>

        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          Your application has been successfully submitted.
        </p>

        <div style="background-color: #f0f8f3; border-left: 4px solid #31a24c; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #333; font-size: 14px;">
            <strong>✓ What happens next?</strong><br>
            The recruiter will review your application and get back to you soon. You can track your application status in your dashboard.
          </p>
        </div>

        <div style="background-color: #fff9e6; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #333; font-size: 14px;">
            <strong>💡 Pro Tip:</strong> Keep your profile updated with your latest skills and experience to improve your chances of getting hired.
          </p>
        </div>

        <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
          This is an automated email. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};

// Send application confirmation email
const sendApplicationEmail = async (recipientEmail, jobTitle, companyName, applicantName) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recipientEmail,
      subject: `Application Confirmation - ${jobTitle} at ${companyName}`,
      html: getApplicationEmailTemplate(jobTitle, companyName, applicantName),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendApplicationEmail };
