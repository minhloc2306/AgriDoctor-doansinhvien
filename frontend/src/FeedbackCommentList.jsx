import React, { useEffect, useState } from "react";
import { getFeedbackCommentsByPostId } from "./services/feedbackService";

const FeedbackCommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setError("");
    getFeedbackCommentsByPostId(postId)
      .then((res) => {
        setComments(res.data || res);
      })
      .catch(() => {
        setError("Không thể tải bình luận.");
      })
      .finally(() => setLoading(false));
  }, [postId]);

  if (!postId) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Ý kiến đã đăng</h3>
      {loading && <div>Đang tải góp ý...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && comments.length === 0 && (
        <div>Chưa có góp ý nào cho bài viết này.</div>
      )}
      <ul className="space-y-3">
        {comments.map((comment) => (
          <li
            key={comment._id}
            className="border rounded px-4 py-2 bg-gray-50"
          >
            <div className="font-medium text-green-700">
              {/* Giả sử backend trả về trường 'name' */}
              {comment.name || "Ẩn danh"}
            </div>
            <div className="text-gray-800 whitespace-pre-line">{comment.content}</div>
            <div className="text-xs text-gray-400 italic mt-1">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString("vi-VN")
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackCommentList;