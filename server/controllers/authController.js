const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const formatUserResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});

const handleValidationError = (res, message) =>
  res.status(400).json({ message });

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return handleValidationError(
        res,
        "Name, email, and password are required."
      );
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedRole = ["admin", "user"].includes(role) ? role : "user";

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "Signup successful.",
      ...formatUserResponse(user, token),
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleValidationError(res, "Email and password are required.");
    }

    const normalizedEmail = email.toLowerCase();
    console.log('Login attempt for email:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log('User found, comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful.",
      ...formatUserResponse(user, token),
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

