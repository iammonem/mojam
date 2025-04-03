const Reference = require('../models/Reference');
const MainMeaning = require('../models/MainMeaning');
const SubMeaning = require('../models/SubMeaning');
const asyncHandler = require('express-async-handler');

// @desc    Get all references
// @route   GET /api/references
// @access  Public
const getReferences = asyncHandler(async (req, res) => {
  const { mainMeaning, subMeaning, type } = req.query;
  
  // Build filter object based on query parameters
  const filter = {};
  if (mainMeaning) filter.mainMeaning = mainMeaning;
  if (subMeaning) filter.subMeaning = subMeaning;
  if (type) filter.type = type;
  
  const references = await Reference.find(filter)
    .populate('mainMeaning', 'title')
    .populate('subMeaning', 'title')
    .sort({ createdAt: -1 });
  
  res.json(references);
});

// @desc    Get a reference by ID
// @route   GET /api/references/:id
// @access  Public
const getReferenceById = asyncHandler(async (req, res) => {
  const reference = await Reference.findById(req.params.id)
    .populate('mainMeaning', 'title')
    .populate('subMeaning', 'title');
  
  if (reference) {
    res.json(reference);
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Create a new reference
// @route   POST /api/references
// @access  Public
const createReference = asyncHandler(async (req, res) => {
  const {
    type, content, meaning, mainMeaning, subMeaning,
    poet, era, narrator, hadith_grade, explanation,
    source, revelation_reason, interpretation, context, tags
  } = req.body;
  
  // Check if main meaning exists
  const mainMeaningExists = await MainMeaning.findById(mainMeaning);
  if (!mainMeaningExists) {
    res.status(400);
    throw new Error('المعنى الرئيسي غير موجود');
  }
  
  // Check if sub meaning exists if provided
  if (subMeaning) {
    const subMeaningExists = await SubMeaning.findById(subMeaning);
    if (!subMeaningExists) {
      res.status(400);
      throw new Error('المعنى الفرعي غير موجود');
    }
  }
  
  const reference = await Reference.create({
    type,
    content,
    meaning,
    mainMeaning,
    subMeaning,
    poet,
    era,
    narrator,
    hadith_grade,
    explanation,
    source,
    revelation_reason,
    interpretation,
    context,
    tags: tags || [],
    likes: 0,
    dislikes: 0,
    comments: []
  });
  
  if (reference) {
    // Update count in main meaning and sub meaning
    mainMeaningExists.count += 1;
    await mainMeaningExists.save();
    
    if (subMeaning) {
      const subMeaningObj = await SubMeaning.findById(subMeaning);
      if (subMeaningObj) {
        subMeaningObj.count += 1;
        await subMeaningObj.save();
      }
    }
    
    res.status(201).json(reference);
  } else {
    res.status(400);
    throw new Error('بيانات غير صالحة');
  }
});

// @desc    Update a reference
// @route   PUT /api/references/:id
// @access  Public
const updateReference = asyncHandler(async (req, res) => {
  const reference = await Reference.findById(req.params.id);
  
  if (reference) {
    // Update all fields that are sent in the request
    Object.keys(req.body).forEach(key => {
      // Don't update comments directly through this endpoint
      if (key !== 'comments') {
        reference[key] = req.body[key];
      }
    });
    
    const updatedReference = await reference.save();
    res.json(updatedReference);
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Delete a reference
// @route   DELETE /api/references/:id
// @access  Public
const deleteReference = asyncHandler(async (req, res) => {
  const reference = await Reference.findById(req.params.id);
  
  if (reference) {
    // Update count in main meaning and sub meaning
    const mainMeaning = await MainMeaning.findById(reference.mainMeaning);
    if (mainMeaning) {
      mainMeaning.count = Math.max(0, mainMeaning.count - 1);
      await mainMeaning.save();
    }
    
    if (reference.subMeaning) {
      const subMeaning = await SubMeaning.findById(reference.subMeaning);
      if (subMeaning) {
        subMeaning.count = Math.max(0, subMeaning.count - 1);
        await subMeaning.save();
      }
    }
    
    await reference.deleteOne();
    res.json({ message: 'تم حذف الشاهد' });
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Add a comment to a reference
// @route   POST /api/references/:id/comments
// @access  Public
const addComment = asyncHandler(async (req, res) => {
  const { user, text } = req.body;
  
  const reference = await Reference.findById(req.params.id);
  
  if (reference) {
    const comment = {
      user,
      text,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };
    
    reference.comments.push(comment);
    await reference.save();
    
    res.status(201).json(comment);
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Add a reply to a comment
// @route   POST /api/references/:id/comments/:commentId/replies
// @access  Public
const addReply = asyncHandler(async (req, res) => {
  const { user, text } = req.body;
  const { id, commentId } = req.params;
  
  const reference = await Reference.findById(id);
  
  if (reference) {
    const comment = reference.comments.id(commentId);
    
    if (comment) {
      const reply = {
        user,
        text,
        timestamp: new Date(),
        likes: 0
      };
      
      comment.replies.push(reply);
      await reference.save();
      
      res.status(201).json(reply);
    } else {
      res.status(404);
      throw new Error('التعليق غير موجود');
    }
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Like or dislike a reference
// @route   PUT /api/references/:id/like
// @access  Public
const likeReference = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'like' or 'dislike'
  
  const reference = await Reference.findById(req.params.id);
  
  if (reference) {
    if (action === 'like') {
      reference.likes += 1;
    } else if (action === 'dislike') {
      reference.dislikes += 1;
    } else {
      res.status(400);
      throw new Error('الإجراء غير صالح، يجب أن يكون "like" أو "dislike"');
    }
    
    await reference.save();
    res.json({ likes: reference.likes, dislikes: reference.dislikes });
  } else {
    res.status(404);
    throw new Error('الشاهد غير موجود');
  }
});

// @desc    Search references
// @route   GET /api/references/search
// @access  Public
const searchReferences = asyncHandler(async (req, res) => {
  const { query, type } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('يرجى تقديم استعلام البحث');
  }
  
  const filter = {
    $or: [
      { content: { $regex: query, $options: 'i' } },
      { meaning: { $regex: query, $options: 'i' } },
      { context: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  if (type) {
    filter.type = type;
  }
  
  const references = await Reference.find(filter)
    .populate('mainMeaning', 'title')
    .populate('subMeaning', 'title')
    .sort({ createdAt: -1 });
  
  res.json(references);
});

module.exports = {
  getReferences,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
  addComment,
  addReply,
  likeReference,
  searchReferences
};
