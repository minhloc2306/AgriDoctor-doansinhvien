const Review = require('../models/Review');

const submitReview = async (req, res) => {
  try {
    const { content, diseaseId } = req.body;

    if (!content || !diseaseId) {
      return res.status(400).json({ msg: 'Thiếu nội dung hoặc ID bệnh' });
    }

    const newReview = new Review({
      content,
      diseaseId,
      submittedBy: req.user.id,
      approved: false,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error submitReview:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const getApprovedReviewsByDisease = async (req, res) => {
  try {
    const reviews = await Review.find({
      diseaseId: req.params.diseaseId,
      approved: true,
    })
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Error getApprovedReviewsByDisease:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Không tìm thấy góp ý' });

    review.approved = true;
    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Error approveReview:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Không tìm thấy góp ý' });

    res.json({ msg: 'Đã xóa góp ý' });
  } catch (err) {
    console.error('Error deleteReview:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
};

module.exports = {
  submitReview,
  getApprovedReviewsByDisease,
  approveReview,
  deleteReview,
};
