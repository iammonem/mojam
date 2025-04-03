const mongoose = require('mongoose');

const mainMeaningSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    count: {
      type: Number,
      default: 0
    },
    letter: {
      type: String,
      required: true,
      enum: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي']
    }
  },
  {
    timestamps: true
  }
);

const MainMeaning = mongoose.model('MainMeaning', mainMeaningSchema);

module.exports = MainMeaning;
