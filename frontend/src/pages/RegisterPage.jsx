import React, { useState } from 'react';
import { register } from '../services/authService'; // Adjust path if necessary
import { Link, useNavigate } from 'react-router-dom'; // Assuming you'll use React Router
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'; // Import icons

// Use the same enhanced Logo component
const Logo = () => (
  <div className="text-center mb-10">
    {/* Replace with your actual image logo if available */}
    {/* <img src="/path/to/your/logo.png" alt="AgriDoctor Logo" className="mx-auto h-12 w-auto" /> */}
    <span className="text-4xl font-bold text-green-700 tracking-tight">AgriDoctor</span>
    <p className="text-sm text-gray-500 mt-1">Giải pháp cho cây trồng của bạn</p>
  </div>
);

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }

    setLoading(true);
    try {
      const userData = { name, email, password };
      const data = await register(userData);
      console.log('Đăng ký thành công:', data);
      navigate('/');
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
       if (err && err.msg) {
          errorMessage = err.msg;
      } else if (err && Array.isArray(err.errors)) {
         errorMessage = err.errors.map(e => e.msg).join(', ');
      } else if (typeof err === 'string') {
          errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop'; // Rice paddy field

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center px-4 py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${backgroundImageUrl})`,
      }}
    >
      {/* Form Container */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50">
        <Logo />
        {/* <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Đăng Ký Tài Khoản</h2> */}
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-md" role="alert">
               <p className="font-semibold">Lỗi Đăng Ký</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {/* Name Input */}
          <div className="relative rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition duration-150 ease-in-out">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Họ và Tên"
            />
          </div>
          {/* Email Input */}
           <div className="relative rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition duration-150 ease-in-out">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Địa chỉ email"
            />
          </div>
          {/* Password Input */}
          <div className="relative rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition duration-150 ease-in-out">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
            />
          </div>
          {/* Confirm Password Input */}
          <div className="relative rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition duration-150 ease-in-out">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition duration-150 ease-in-out ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                 {!loading && <FiUserPlus className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />}
              </span>
              {loading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng Ký'
              )}
            </button>
          </div>
          {/* Link to Login */}
           <div className="text-sm text-center text-gray-500 pt-4 border-t border-gray-200/80">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
              Đăng nhập tại đây
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage; 