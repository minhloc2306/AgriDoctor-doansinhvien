const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên của bạn.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email của bạn.'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Vui lòng nhập địa chỉ email hợp lệ.'],
    },
    subject: {
        type: String,
        required: [true, 'Vui lòng nhập chủ đề.'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung tin nhắn.'],
    },
    type: { // e.g., 'general', 'question', 'bug', 'suggestion'
        type: String,
        trim: true,
        default: 'general',
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'closed'],
        default: 'new',
    },
    submittedBy: { // Optional: link to user if logged in
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Feedback', feedbackSchema); 