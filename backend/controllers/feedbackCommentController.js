const FeedbackComment = require('../models/FeedbackComment');

// Thêm góp ý (public)
exports.addFeedbackComment = async (req, res) => {
    try {
        const { postId, name, content } = req.body;
        if (!content || !postId) {
            return res.status(400).json({ msg: 'Thiếu nội dung hoặc thiếu bài viết.' });
        }
        const feedbackComment = new FeedbackComment({
            post: postId,
            name: name && name.trim() ? name.trim() : undefined,
            content
        });
        await feedbackComment.save();
        res.status(201).json({ msg: 'Góp ý đã được gửi, chờ kiểm duyệt.' });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// Lấy góp ý đã duyệt cho bài viết (public)
exports.getFeedbackCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const feedbackComments = await FeedbackComment.find({ post: postId, approved: true }).sort({ createdAt: -1 });
        res.json(feedbackComments);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// ADMIN: Lấy tất cả góp ý
exports.getAllFeedbackComments = async (req, res) => {
    try {
        const feedbackComments = await FeedbackComment.find().populate('post', 'title').sort({ createdAt: -1 });
        res.json(feedbackComments);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// ADMIN: Duyệt góp ý
exports.approveFeedbackComment = async (req, res) => {
    try {
        const { id } = req.params;
        const feedbackComment = await FeedbackComment.findByIdAndUpdate(id, { approved: true }, { new: true });
        if (!feedbackComment) return res.status(404).json({ msg: 'Không tìm thấy góp ý.' });
        res.json({ msg: 'Đã duyệt góp ý.' });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// ADMIN: Xóa góp ý
exports.deleteFeedbackComment = async (req, res) => {
    try {
        const { id } = req.params;
        await FeedbackComment.findByIdAndDelete(id);
        res.json({ msg: 'Đã xóa góp ý.' });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};