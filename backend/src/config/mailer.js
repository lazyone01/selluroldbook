const nodemailer = require("nodemailer");

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPass) {
    throw new Error("Missing EMAIL_USER or EMAIL_APP_PASSWORD");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    family: 4,
  });

  transporter.verify((error) => {
    if (error) {
      console.error("SMTP Config Error:", error);
    } else {
      console.log("SMTP Server Ready");
    }
  });

  return transporter;
};

const sendOtpEmail = async (to, otp, purpose) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"SellUrOldBook" <${process.env.EMAIL_USER}>`,
      to,
      subject: `SellUrOldBook ${purpose} OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 16px;">
          <h2>SellUrOldBook Verification Code</h2>
          <p>Your one-time password for <strong>${purpose}</strong> is:</p>
          <div style="font-size: 28px; letter-spacing: 4px; font-weight: 700; margin: 14px 0;">${otp}</div>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("OTP Send Error:", error);
    throw error;
  }
};

module.exports = { sendOtpEmail };