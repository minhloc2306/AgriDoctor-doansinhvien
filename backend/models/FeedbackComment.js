const mongoose = require('mongoose');

const feedbackCommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    name: { type: String, default: 'Ẩn danh' },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedbackComment', feedbackCommentSchema);