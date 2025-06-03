const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // Optional: Add a field to track who created it
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', CategorySchema); 