import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">Trang bạn tìm không tồn tại.</p>
        <p className="text-sm text-gray-500 mt-2">Có thể liên kết đã bị thay đổi hoặc không còn tồn tại nữa.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-5 py-2 border border-gray-500 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
