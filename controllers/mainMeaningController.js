const MainMeaning = require('../models/MainMeaning');
const asyncHandler = require('express-async-handler');

// @desc    Get all main meanings
// @route   GET /api/meanings
// @access  Public
const getMainMeanings = asyncHandler(async (req, res) => {
  const letter = req.query.letter;
  const filter = letter ? { letter } : {};
  
  const mainMeanings = await MainMeaning.find(filter).sort({ title: 1 });
  res.json(mainMeanings);
});

// @desc    Get a main meaning by ID
// @route   GET /api/meanings/:id
// @access  Public
const getMainMeaningById = asyncHandler(async (req, res) => {
  const mainMeaning = await MainMeaning.findById(req.params.id);
  
  if (mainMeaning) {
    res.json(mainMeaning);
  } else {
    res.status(404);
    throw new Error('المعنى غير موجود');
  }
});

// @desc    Create a new main meaning
// @route   POST /api/meanings
// @access  Public
const createMainMeaning = asyncHandler(async (req, res) => {
  const { title, letter } = req.body;
  
  const meaningExists = await MainMeaning.findOne({ title });
  
  if (meaningExists) {
    res.status(400);
    throw new Error('المعنى موجود بالفعل');
  }
  
  const mainMeaning = await MainMeaning.create({
    title,
    letter,
    count: 0
  });
  
  if (mainMeaning) {
    res.status(201).json(mainMeaning);
  } else {
    res.status(400);
    throw new Error('بيانات غير صالحة');
  }
});

// @desc    Update a main meaning
// @route   PUT /api/meanings/:id
// @access  Public
const updateMainMeaning = asyncHandler(async (req, res) => {
  const { title, letter, count } = req.body;
  
  const mainMeaning = await MainMeaning.findById(req.params.id);
  
  if (mainMeaning) {
    mainMeaning.title = title || mainMeaning.title;
    mainMeaning.letter = letter || mainMeaning.letter;
    mainMeaning.count = count !== undefined ? count : mainMeaning.count;
    
    const updatedMainMeaning = await mainMeaning.save();
    res.json(updatedMainMeaning);
  } else {
    res.status(404);
    throw new Error('المعنى غير موجود');
  }
});

// @desc    Delete a main meaning
// @route   DELETE /api/meanings/:id
// @access  Public
const deleteMainMeaning = asyncHandler(async (req, res) => {
  const mainMeaning = await MainMeaning.findById(req.params.id);
  
  if (mainMeaning) {
    await mainMeaning.deleteOne();
    res.json({ message: 'تم حذف المعنى' });
  } else {
    res.status(404);
    throw new Error('المعنى غير موجود');
  }
});

module.exports = {
  getMainMeanings,
  getMainMeaningById,
  createMainMeaning,
  updateMainMeaning,
  deleteMainMeaning
};
