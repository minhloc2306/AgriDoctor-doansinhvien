import { Link } from 'react-router-dom';

const AdminNotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-semibold text-gray-800">404</h1>
        <p className="text-lg mt-3 text-gray-600">Không tìm thấy trang quản trị.</p>
        <p className="text-sm text-gray-500 mt-1">Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang dashboard.</p>
        <Link
          to="/admin"
          className="inline-block mt-5 px-5 py-2 border border-gray-400 text-gray-700 text-sm rounded hover:bg-gray-100 transition"
        >
          Quay về Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminNotFound;
