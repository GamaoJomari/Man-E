const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const auth = require('../middleware/auth');

// Create a new course
router.post('/courses', auth, async (req, res) => {
  try {
    const { courseCode, name, description, instructorId, schedule, location } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Create new course
    const course = new Course({
      courseCode,
      name,
      description,
      instructorId,
      schedule,
      location,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Get all courses
router.get('/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'fullName');
    res.json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Error getting courses', error: error.message });
  }
});

// Get course by ID
router.get('/courses/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'fullName');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ message: 'Error getting course', error: error.message });
  }
});

// Update course
router.put('/courses/:id', auth, async (req, res) => {
  try {
    const { courseCode, name, description, instructorId, schedule, location } = req.body;

    // Check if course exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update course
    course.courseCode = courseCode || course.courseCode;
    course.name = name || course.name;
    course.description = description || course.description;
    course.instructorId = instructorId || course.instructorId;
    course.schedule = schedule || course.schedule;
    course.location = location || course.location;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course
router.delete('/courses/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;
