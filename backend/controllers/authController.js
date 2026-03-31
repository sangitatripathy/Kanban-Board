import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/sendEmail.js";
import crypto from "crypto";
import { redisClient } from "../server.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file
    let imageUrl =null
    if(file){
      imageUrl=`/uploads/${file.filename}`
    }

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if (await redisClient.get(rateLimitKey)) {
      return res.status(429).json({
        message: "Too many requests, try again later",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      imageUrl,
      role: "member",
      isVerified: false,
    });

    const token = generateVerificationToken();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await redisClient.set(`verify:${hashedToken}`, user.email, {
      EX: 600,
    });
    const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;

    await sendEmail({
      email: user.email,
      subject: "verify your email",
      html: `
        <h2>Verify your account</h2>
        <p>Click below to verify:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    await redisClient.set(rateLimitKey, "1", { EX: 60 });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      token: generateToken(user._id),
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const verifyEmailHandler = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const email = await redisClient.get(`verify:${hashedToken}`);

    if (!email) {
      return res
        .status(400)
        .json({ message: "Already verified or expired" });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redisClient.del(`verify:${hashedToken}`);

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error.message);
    return res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If user exists, a reset link has been sent" });
    }
    const token = generateVerificationToken();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await redisClient.set(`reset:${hashedToken}`, user.email, { EX: 600 });
    const resetUrl = `http://localhost:3000/api/auth/resetpassword?token=${token}`;
    await sendEmail({
      email,
      subject: "Reset Password",
      html: `<h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>`,
    });
    return res
      .status(200)
      .json({ message: "If user exists, a reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
};

export const resetpassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      message: "New password is required",
    });
  }

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const email = await redisClient.get(`reset:${hashedToken}`);
  if (!email) {
    return res.status(400).json({
      message: "Invalid or expired link",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const user = User.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await redisClient.del(`reset:${hashedToken}`);

  res.status(200).json({
    message: "Password reset successful",
  });
};
