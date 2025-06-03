// pages/admin/CommentListPage.jsx
import React, { useEffect, useState } from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

const CommentListPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/feedback/comment/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Lỗi khi lấy góp ý:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id) => {
    if (!window.confirm('Bạn có chắc muốn duyệt góp ý này?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/feedback/comment/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Lỗi khi duyệt góp ý:', err);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa góp ý này?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/feedback/comment/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Lỗi khi xóa góp ý:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý góp ý bài viết</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : comments.length === 0 ? (
        <p>Chưa có góp ý nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Tên người gửi</th>
                <th className="p-3 border">Nội dung</th>
                <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c._id}>
                  <td className="p-3 border">{c.user?.name || 'Ẩn danh'}</td>
                  <td className="p-3 border">{c.content}</td>
                  <td className="p-3 border">
                    {c.approved ? (
                      <span className="text-green-600">Đã duyệt</span>
                    ) : (
                      <span className="text-yellow-600">Chưa duyệt</span>
                    )}
                  </td>
                  <td className="p-3 border space-x-2">
                    {!c.approved && (
                      <button
                        onClick={() => approveComment(c._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommentListPage;
