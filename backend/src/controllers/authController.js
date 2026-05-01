const bcrypt = require("bcryptjs");
const OtpVerification = require("../models/OtpVerification");
const { sendOtpEmail } = require("../config/mailer");
const generateOtp = require("../utils/generateOtp");
const { signToken } = require("../utils/jwt");
const { getModelByRole } = require("../utils/roleModelMap");

const allowedRoles = ["user", "bookseller", "admin"];
const allowedPurposes = ["signup", "login"];

const requestOtp = async (req, res) => {
  const { email, role, adminSignupKey } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required." });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const Model = getModelByRole(role);
  const existing = await Model.findOne({ email: normalizedEmail });

  if (existing) {
    return res.status(409).json({ message: "Account already exists for this email." });
  }

  if (role === "admin" && process.env.ADMIN_SIGNUP_KEY && adminSignupKey !== process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({ message: "Invalid admin signup key." });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OtpVerification.findOneAndUpdate(
    { email: normalizedEmail, role, purpose: "signup", consumed: false },
    { otpHash, expiresAt, consumed: false },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendOtpEmail(normalizedEmail, otp, "Signup");

  return res.status(200).json({ message: "OTP sent successfully." });
};

const signup = async (req, res) => {
  const { name, email, password, address, role, otp, adminSignupKey } = req.body;

  if (!name || !email || !password || !address || !role || !otp) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  if (role === "admin" && process.env.ADMIN_SIGNUP_KEY && adminSignupKey !== process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({ message: "Invalid admin signup key." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const Model = getModelByRole(role);

  const existing = await Model.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: "Account already exists." });
  }

  const otpDoc = await OtpVerification.findOne({
    email: normalizedEmail,
    role,
    purpose: "signup",
    consumed: false,
  }).sort({ createdAt: -1 });

  if (!otpDoc || otpDoc.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP is invalid or expired." });
  }

  const isOtpValid = await bcrypt.compare(otp, otpDoc.otpHash);
  if (!isOtpValid) {
    return res.status(400).json({ message: "OTP is invalid." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const account = await Model.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    address: address.trim(),
  });

  otpDoc.consumed = true;
  await otpDoc.save();

  const token = signToken({ id: account._id, role, email: account.email });

  return res.status(201).json({
    message: "Signup successful.",
    token,
    user: {
      id: account._id,
      name: account.name,
      email: account.email,
      address: account.address,
      role,
    },
  });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const Model = getModelByRole(role);
  const account = await Model.findOne({ email: normalizedEmail });

  if (!account) {
    return res.status(404).json({ message: "Account not found." });
  }

  const isPasswordValid = await bcrypt.compare(password, account.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = signToken({ id: account._id, role, email: account.email });

  return res.status(200).json({
    message: "Login successful.",
    token,
    user: {
      id: account._id,
      name: account.name,
      email: account.email,
      address: account.address,
      role,
    },
  });
};

const getMe = async (req, res) => {
  const { id, role } = req.user;
  const Model = getModelByRole(role);

  const account = await Model.findById(id).select("-password");
  if (!account) {
    return res.status(404).json({ message: "Account not found." });
  }

  return res.status(200).json({ user: { ...account.toObject(), role } });
};

module.exports = {
  requestOtp,
  signup,
  login,
  getMe,
};
