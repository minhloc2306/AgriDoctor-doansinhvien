import React, { useEffect, useState } from 'react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();
  const [onlineUsers, setOnlineUsers] = useState(() => Math.floor(Math.random() * 15) + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        let next = prev + change;

        if (next < 1) next = 1;
        if (next > 15) next = 15;

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {currentYear} AgriDoctor. All rights reserved.</p>
        <div className="mt-2">
          <a href="/privacy-policy" className="text-gray-400 hover:text-white text-xs px-2">
            Đã truy cập: 780 lượt
          </a>
          <span className="text-gray-500">|</span>
          <a href="/terms-of-service" className="text-gray-400 hover:text-white text-xs px-2">
            Đang online: {onlineUsers}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
