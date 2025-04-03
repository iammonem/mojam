const SubMeaning = require('../models/SubMeaning');
const MainMeaning = require('../models/MainMeaning');
const asyncHandler = require('express-async-handler');

// @desc    Get all sub meanings
// @route   GET /api/submeanings
// @access  Public
const getSubMeanings = asyncHandler(async (req, res) => {
  const mainMeaningId = req.query.mainMeaning;
  const filter = mainMeaningId ? { mainMeaning: mainMeaningId } : {};
  
  const subMeanings = await SubMeaning.find(filter)
    .populate('mainMeaning', 'title')
    .sort({ title: 1 });
  
  res.json(subMeanings);
});

// @desc    Get a sub meaning by ID
// @route   GET /api/submeanings/:id
// @access  Public
const getSubMeaningById = asyncHandler(async (req, res) => {
  const subMeaning = await SubMeaning.findById(req.params.id)
    .populate('mainMeaning', 'title');
  
  if (subMeaning) {
    res.json(subMeaning);
  } else {
    res.status(404);
    throw new Error('المعنى الفرعي غير موجود');
  }
});

// @desc    Create a new sub meaning
// @route   POST /api/submeanings
// @access  Public
const createSubMeaning = asyncHandler(async (req, res) => {
  const { title, mainMeaning, description } = req.body;
  
  // Check if main meaning exists
  const mainMeaningExists = await MainMeaning.findById(mainMeaning);
  
  if (!mainMeaningExists) {
    res.status(400);
    throw new Error('المعنى الرئيسي غير موجود');
  }
  
  const subMeaning = await SubMeaning.create({
    title,
    mainMeaning,
    description,
    count: 0
  });
  
  if (subMeaning) {
    // Update count in main meaning
    mainMeaningExists.count += 1;
    await mainMeaningExists.save();
    
    res.status(201).json(subMeaning);
  } else {
    res.status(400);
    throw new Error('بيانات غير صالحة');
  }
});

// @desc    Update a sub meaning
// @route   PUT /api/submeanings/:id
// @access  Public
const updateSubMeaning = asyncHandler(async (req, res) => {
  const { title, description, count } = req.body;
  
  const subMeaning = await SubMeaning.findById(req.params.id);
  
  if (subMeaning) {
    subMeaning.title = title || subMeaning.title;
    subMeaning.description = description || subMeaning.description;
    subMeaning.count = count !== undefined ? count : subMeaning.count;
    
    const updatedSubMeaning = await subMeaning.save();
    res.json(updatedSubMeaning);
  } else {
    res.status(404);
    throw new Error('المعنى الفرعي غير موجود');
  }
});

// @desc    Delete a sub meaning
// @route   DELETE /api/submeanings/:id
// @access  Public
const deleteSubMeaning = asyncHandler(async (req, res) => {
  const subMeaning = await SubMeaning.findById(req.params.id);
  
  if (subMeaning) {
    // Update count in main meaning
    const mainMeaning = await MainMeaning.findById(subMeaning.mainMeaning);
    if (mainMeaning) {
      mainMeaning.count = Math.max(0, mainMeaning.count - 1);
      await mainMeaning.save();
    }
    
    await subMeaning.deleteOne();
    res.json({ message: 'تم حذف المعنى الفرعي' });
  } else {
    res.status(404);
    throw new Error('المعنى الفرعي غير موجود');
  }
});

module.exports = {
  getSubMeanings,
  getSubMeaningById,
  createSubMeaning,
  updateSubMeaning,
  deleteSubMeaning
};
