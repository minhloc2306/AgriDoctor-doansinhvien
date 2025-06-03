import React, { useEffect, useState } from 'react';

const VisitorStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Thay thế VITE_API_URL bằng URL backend thật (hoặc dùng biến môi trường)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    fetch(`${apiUrl}/stats`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(err => {
        console.error('Lỗi tải thống kê:', err);
        setError('Không tải được thống kê.');
      });
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg shadow-md mt-10 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) return (
    <div className="text-center py-4 text-green-700">Đang tải thống kê...</div>
  );

  return (
    <div className="bg-green-100 p-6 rounded-lg shadow-md mt-10 text-sm">
      <h4 className="text-lg font-bold mb-3 text-green-800">📊 Thống kê truy cập</h4>
      <ul className="space-y-1 text-green-700">
        <li>👥 Đang truy cập: <strong>{stats.online}</strong></li>
        <li>📈 Tổng lượt truy cập: <strong>{stats.total}</strong></li>
        <li>🧑‍🌾 Số tài khoản đã đăng ký: <strong>{stats.users}</strong></li>
      </ul>
    </div>
  );
};

export default VisitorStats;
