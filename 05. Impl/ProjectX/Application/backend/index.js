require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Sign up endpoint (admin only)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = new User({
      username,
      password, // Will be hashed by the pre-save middleware
      email,
      fullName,
      role: 'admin', // Only admins can sign up directly
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create user endpoint (admin only)
app.post('/api/users/create', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { username, password, email, fullName, role } = req.body;
    
    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      email,
      fullName,
      role,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});