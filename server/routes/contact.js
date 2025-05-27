const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use your own authenticated email here
      to: process.env.EMAIL_USER, // Your main receiving address
      cc: email, // Sends a copy to the user who submitted the form
      subject: `${subject}`,
      text: `From: ${name} <${email}>\n\nMessage:\n${message}`, // plain text fallback
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #00509E;">New Message from Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="margin: 20px 0;" />
      <p style="white-space: pre-wrap;"><strong>Message:</strong><br/>${message}</p>
      <hr />
      <p style="font-size: 0.9em; color: #888;">This email was sent from your website contact form.</p>
    </div>
  `,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
