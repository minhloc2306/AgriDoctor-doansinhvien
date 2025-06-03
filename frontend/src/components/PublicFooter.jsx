import React from 'react';
import VisitorStats from "./VisitorStats";  // ✅ đúng vì cả 2 file cùng nằm trong src/components/

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">

        {/* ✅ THÊM: Gọi component VisitorStats để hiển thị thống kê truy cập */}
        <div className="mb-4">
          <VisitorStats />
        </div>

        {/* ✔️ Giữ nguyên nội dung bản quyền */}
        <p className="text-sm">&copy; {currentYear} AgriDoctor. All rights reserved.</p>

        {/* ❌ CHÚ THÍCH: Nếu bạn muốn thêm các link chính sách sau này thì bỏ comment ở đây */}
        {/* <div className="mt-2">
          <a href="/privacy-policy" className="text-gray-400 hover:text-white text-xs px-2">Privacy Policy</a>
          <span className="text-gray-500">|</span>
          <a href="/terms-of-service" className="text-gray-400 hover:text-white text-xs px-2">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
};

export default PublicFooter;
