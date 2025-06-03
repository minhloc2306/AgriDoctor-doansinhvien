const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * Gửi góp ý mới (yêu cầu đăng nhập)
 */
router.post(
  '/',
  verifyToken,
  [
    check('content', 'Nội dung góp ý không được để trống').not().isEmpty(),
    check('diseaseId', 'ID bệnh không được để trống').not().isEmpty(),
  ],
  reviewController.submitReview
);

/**
 * Lấy góp ý đã duyệt cho bệnh (công khai)
 */
router.get('/public/:diseaseId', reviewController.getApprovedReviewsByDisease);

/**
 * Duyệt góp ý (admin)
 */
router.patch('/:id/approve', verifyToken, isAdmin, reviewController.approveReview);

/**
 * Xóa góp ý (admin)
 */
router.delete('/:id', verifyToken, isAdmin, reviewController.deleteReview);

module.exports = router;
