const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Idea, User, Interest } = require('../models');


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role 
    });

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user.id } }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Return token and user data (excluding password)
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user.id } }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Return token and user data (excluding password)
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.profile = async (req, res) => {
  try {
    // Get user profile (req.user is set by auth middleware)
    const user = await User.findByPk(req.user.id, { 
      attributes: ["id", "username", "email", "role", "createdAt"] 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
};