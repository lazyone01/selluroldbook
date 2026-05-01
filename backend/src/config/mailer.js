const { Resend } = require("resend");

const sendOtpEmail = async (to, otp, purpose) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "SellUrOldBook <onboarding@resend.dev>",
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
};

module.exports = { sendOtpEmail };