const express = require('express');
const router = express.Router();
const feedbackCommentController = require('../controllers/feedbackCommentController');

// Thêm góp ý (public)
router.post('/', feedbackCommentController.addFeedbackComment);

// Lấy góp ý đã duyệt cho bài viết (public)
router.get('/:postId', feedbackCommentController.getFeedbackCommentsForPost);

// ADMIN: Lấy tất cả góp ý
router.get('/', feedbackCommentController.getAllFeedbackComments);

// ADMIN: Duyệt góp ý
router.patch('/:id/approve', feedbackCommentController.approveFeedbackComment);

// ADMIN: Xóa góp ý
router.delete('/:id', feedbackCommentController.deleteFeedbackComment);

module.exports = router;