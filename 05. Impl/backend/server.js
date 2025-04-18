require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection with debug logging
mongoose.set('debug', true); // Enable debug logging

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema with role-based validation
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['administrator', 'instructor', 'student']
  },
  fullName: { type: String, required: true },
  studentId: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: function() { return this.role === 'student'; }
  },
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
  
const User = mongoose.model('User', userSchema);

// Create user endpoint
app.post('/api/users', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, password, role, fullName, studentId, phoneNumber } = req.body;

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Username already exists:', username);
      return res.status(400).json({ 
        error: 'This username is already registered'
      });
    }

    // Check for existing student ID
    if (studentId) {
      const existingStudentId = await User.findOne({ studentId });
      if (existingStudentId) {
        console.log('Student ID already exists:', studentId);
        return res.status(400).json({ 
          error: 'This student ID is already registered'
        });
      }
    }

    // Check for existing name
    const existingName = await User.findOne({ fullName });
    if (existingName) {
      console.log('Full name already exists:', fullName);
      return res.status(400).json({ 
        error: 'A student with this name is already registered'
      });
    }

    console.log('Creating new user...');
    // Create new user
    const user = new User({
      username,
      password,  // Will be hashed by the pre-save middleware
      role,
      fullName,
      studentId,
      phoneNumber
    });

    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: savedUser.username,
        role: savedUser.role,
        fullName: savedUser.fullName,
        studentId: savedUser.studentId,
        phoneNumber: savedUser.phoneNumber
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to register user'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log('Login attempt:', { username, role });
    
    // Special case for admin
    if (username === 'admin' && password === 'admin' && role === 'administrator') {
      const user = await User.findOne({ username: 'admin', role: 'administrator' });
      if (user) {
        return res.json({
          user: {
            username: user.username,
            role: user.role,
            fullName: user.fullName || 'Administrator'
          }
        });
      }
    }

    // For other users
    const user = await User.findOne({ username, role });
    console.log('Found user:', user ? 'yes' : 'no');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or role'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword ? 'yes' : 'no');
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid password'
      });
    }

    res.json({
      user: {
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      error: error.message || 'Login failed'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
