const Feedback = require('../models/Feedback');

/**
 * @desc    Submit new feedback
 * @route   POST /api/feedback
 * @access  Public
 */
const submitFeedback = async (req, res, next) => {
    try {
        const { name, email, subject, message, type } = req.body;

        if (!name || !email || !subject || !message) {
            res.status(400);
            return next(new Error('Vui lòng điền đầy đủ các trường bắt buộc.'));
        }

        const feedback = new Feedback({
            name,
            email,
            subject,
            message,
            type: type || 'general',
        });

        const createdFeedback = await feedback.save();

        res.status(201).json({
            msg: 'Feedback submitted successfully',
            feedback: createdFeedback
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all feedback
 * @route   GET /api/feedback
 * @access  Private/Admin
 */
const getAllFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        res.status(200).json(feedback);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get feedback by ID
 * @route   GET /api/feedback/:id
 * @access  Private/Admin
 */
const getFeedbackById = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (feedback) {
            res.status(200).json(feedback);
        } else {
            res.status(404);
            return next(new Error('Feedback not found'));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update feedback status
 * @route   PUT /api/feedback/:id
 * @access  Private/Admin
 */
const updateFeedbackStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            if (status && !['new', 'read', 'replied', 'closed'].includes(status)) {
                 res.status(400);
                 return next(new Error('Invalid status value'));
            }
            feedback.status = status || feedback.status;
            const updatedFeedback = await feedback.save();
            res.status(200).json(updatedFeedback);
        } else {
            res.status(404);
            return next(new Error('Feedback not found'));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/feedback/:id
 * @access  Private/Admin
 */
const deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            await feedback.deleteOne({ _id: feedback._id });
            res.status(200).json({ msg: 'Feedback removed' });
        } else {
            res.status(404);
            return next(new Error('Feedback not found'));
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    submitFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
    deleteFeedback,
}; 