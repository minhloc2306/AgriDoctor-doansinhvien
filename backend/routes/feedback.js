const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// @route   POST api/feedback
// @desc    Submit feedback, question, or bug report
// @access  Public
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('subject', 'Subject is required').not().isEmpty(),
        check('message', 'Message is required').not().isEmpty(),
        check('type', 'Type is required').isIn(['feedback', 'question', 'bug_report'])
    ],
    feedbackController.submitFeedback
);

// @route   GET api/feedback
// @desc    Get all feedback submissions (Admin only)
// @access  Private (Admin)
router.get('/', [authMiddleware, authMiddleware.isAdmin], feedbackController.getAllFeedback);

// @route   GET api/feedback/:id
// @desc    Get feedback by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', [authMiddleware, authMiddleware.isAdmin], feedbackController.getFeedbackById);

// @route   PUT api/feedback/:id
// @desc    Update feedback status (Admin only)
// @access  Private (Admin)
router.put('/:id',
    [
        authMiddleware,
        authMiddleware.isAdmin,
        check('status', 'Invalid status').isIn(['new', 'reviewed', 'resolved', 'archived'])
    ],
    feedbackController.updateFeedbackStatus
);

// @route   DELETE api/feedback/:id
// @desc    Delete feedback (Admin only)
// @access  Private (Admin)
router.delete('/:id', [authMiddleware, authMiddleware.isAdmin], feedbackController.deleteFeedback);

module.exports = router; 