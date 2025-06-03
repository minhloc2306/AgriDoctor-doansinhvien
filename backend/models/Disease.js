const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    causes: {
        type: String,
    },
    prevention: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Disease category is required']
    },
    images: {
        type: [{
            type: String,
            validate: {
                validator: function(v) {
                    // Kiểm tra định dạng file
                    return /\.(jpg|jpeg|png|gif)$/i.test(v);
                },
                message: props => `${props.value} không phải là định dạng ảnh hợp lệ!`
            }
        }],
        validate: {
            validator: function(v) {
                // Giới hạn số lượng ảnh từ 1-5
                return v.length > 0 && v.length <= 5;
            },
            message: 'Số lượng ảnh phải từ 1 đến 5!'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updatedAt field on save
DiseaseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Disease', DiseaseSchema); 