import nodemailer from "nodemailer";
import "dotenv/config"; 

// --- Nodemailer Setup ---

const transporter = nodemailer.createTransport({
 
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Default for testing
    pass: process.env.EMAIL_PASS, // Default for testing - Use App Password for 2FA
  },
});

// Verify Nodemailer connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer connection error:", error);
 
  } else {
    console.log("Nodemailer is ready to send messages");
  }
});

export default transporter;
