const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "Email already registered" });

  const safeRole = ["student", "instructor"].includes(role) ? role : "student";
  const user = await User.create({ name, email, password, role: safeRole });
  const token = signToken(user._id);

  res.status(201).json({ user, token });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id);
  res.json({ user, token });
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
