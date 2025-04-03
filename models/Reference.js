const mongoose = require('mongoose');

// Schema for replies to comments
const replySchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Schema for comments
const commentSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    },
    replies: [replySchema]
  },
  {
    timestamps: true
  }
);

// Main Reference Schema
const referenceSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['شعر', 'قرآن', 'حديث'],
      default: 'شعر'
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    meaning: {
      type: String,
      required: true,
      trim: true
    },
    mainMeaning: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'MainMeaning'
    },
    subMeaning: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubMeaning'
    },
    // Fields for poetry (شعر)
    poet: {
      type: String,
      trim: true
    },
    era: {
      type: String,
      trim: true
    },
    // Fields for hadith (حديث)
    narrator: {
      type: String,
      trim: true
    },
    hadith_grade: {
      type: String,
      trim: true
    },
    explanation: {
      type: String,
      trim: true
    },
    // Fields for Quran (قرآن)
    source: {
      type: String,
      trim: true
    },
    revelation_reason: {
      type: String,
      trim: true
    },
    interpretation: {
      type: String,
      trim: true
    },
    // Common fields
    context: {
      type: String,
      trim: true
    },
    tags: [String],
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

const Reference = mongoose.model('Reference', referenceSchema);

module.exports = Reference;
