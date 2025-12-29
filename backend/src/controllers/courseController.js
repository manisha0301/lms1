// backend/src/controllers/courseController.js
import {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourseContents
} from '../models/courseModel.js';

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { name, type, price, duration, description, originalPrice } = req.body;
    const image = req.file ? req.file.filename : null;

    // Parse optional JSON fields safely
    let teachers = [];
    let batches = [];
    try {
      teachers = req.body.teachers ? JSON.parse(req.body.teachers) : [];
      batches = req.body.batches ? JSON.parse(req.body.batches) : [];
    } catch (e) {
      // ignore parse errors
    }

    // Handle originalPrice - only if manually provided (no auto 2x)
    let finalOriginalPrice = null;
    if (originalPrice && originalPrice.trim() !== "") {
      finalOriginalPrice = parseFloat(originalPrice);
    }

    const newCourse = await addCourse({
      image,
      name,
      type: type || 'Live',
      price: parseFloat(price),
      duration: duration || null,
      description: description || '',
      teachers,
      batches,
      originalPrice: finalOriginalPrice
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, error: 'Failed to add course' });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    console.error('Get single course error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update course contents
export const updateContents = async (req, res) => {
  try {
    const { contents } = req.body;
    const updatedCourse = await updateCourseContents(req.params.id, contents);
    if (!updatedCourse) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Update contents error:', error);
    res.status(500).json({ success: false, error: 'Failed to update contents' });
  }
};

