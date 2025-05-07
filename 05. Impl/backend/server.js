require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const userRoutes = require('./routes/user.routes');

// Use routes
app.use('/api', userRoutes);

// MongoDB connection with debug logging
mongoose.set('debug', true); // Enable debug logging

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch(err => console.error('MongoDB connection error:', err));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
