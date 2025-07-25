import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create reusable transporter object using SMTP with Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS,   
      },
    });
// console.log("EMAIL:", process.env.EMAIL_USER);
// console.log("PASS:", process.env.EMAIL_PASS);

    // Mail options
    const mailOptions = {
      from: `"Shree Aaiji Restaurant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};
