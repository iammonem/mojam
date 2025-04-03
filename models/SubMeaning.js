const mongoose = require('mongoose');

const subMeaningSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    mainMeaning: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'MainMeaning'
    },
    description: {
      type: String,
      trim: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const SubMeaning = mongoose.model('SubMeaning', subMeaningSchema);

module.exports = SubMeaning;
