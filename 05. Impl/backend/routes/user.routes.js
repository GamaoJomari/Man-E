const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, fullName, studentId } = req.body;

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'This username is already registered' });
    }

    // Check for existing student ID if provided
    if (studentId) {
      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        return res.status(400).json({ error: 'This student ID is already registered' });
      }
    }

    // Check for existing full name
    const existingName = await User.findOne({ fullName });
    if (existingName) {
      return res.status(400).json({ error: 'A student with this name is already registered' });
    }

    const user = new User(req.body);
    await user.save();
    
    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Find user by username and role
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or role' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
