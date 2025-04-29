const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Handle profile image upload
router.post('/upload-profile-image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file received in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File received:', req.file);
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    // Update user profile with new image URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.put('/users/:id/profile', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user from token
router.get('/users/me', verifyToken, async (req, res) => {
  try {
    // Get user ID from token
    const { id } = req.user;
    
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get('/users', verifyToken, async (req, res) => {
  try {
    const { role } = req.query;
    
    // Verify that the requesting user is an administrator
    if (req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'Access denied. Administrator only.' });
    }

    // Build query based on role parameter
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
