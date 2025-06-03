const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Gửi bình luận mới
router.post('/', verifyToken, async (req, res) => {
  const { diseaseId, content } = req.body;
  const feedback = new Feedback({ user: req.user.id, disease: diseaseId, content });
  await feedback.save();
  res.status(201).json({ message: 'Góp ý của bạn đã được gửi và đang chờ duyệt.' });
});

// Lấy danh sách bình luận đã duyệt theo bệnh
router.get('/:diseaseId', async (req, res) => {
  const list = await Feedback.find({ disease: req.params.diseaseId, approved: true })
    .populate('user', 'name');
  res.json(list);
});

// Duyệt bình luận (chỉ admin)
router.put('/:id/approve', verifyToken, isAdmin, async (req, res) => {
  const fb = await Feedback.findById(req.params.id);
  if (!fb) return res.status(404).json({ message: 'Không tìm thấy góp ý' });
  fb.approved = true;
  await fb.save();
  res.json({ message: 'Đã duyệt góp ý' });
});

module.exports = router;
