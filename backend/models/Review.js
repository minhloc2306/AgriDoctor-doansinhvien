const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  diseaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
