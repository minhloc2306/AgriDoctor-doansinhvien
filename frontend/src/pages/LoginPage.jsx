import React, { useState } from 'react';
// import { login as apiLogin } from '../services/authService'; // No longer needed directly
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Placeholder for Logo component or img tag
const Logo = () => (
  <div className="text-center mb-10">
    {/* Replace with your actual image logo if available */}
    {/* <img src="/path/to/your/logo.png" alt="AgriDoctor Logo" className="mx-auto h-12 w-auto" /> */}
    <span className="text-4xl font-bold text-green-700 tracking-tight">AgriDoctor</span>
    <p className="text-sm text-gray-500 mt-1">Giải pháp cho cây trồng của bạn</p>
  </div>
);

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false); // Loading state now managed by AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth(); // Get login function and loading state from context

  // Get the path the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    // setLoading(true); // Context handles loading state
    try {
      const userData = await login({ email, password }); // Use context login
      console.log('Đăng nhập thành công:', userData);
      // Redirect based on role or intended destination
      const destination = userData.role === 'admin' ? '/admin' : from;
      navigate(destination, { replace: true }); // Navigate to intended page or admin dashboard
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      if (err && err.msg) {
          errorMessage = err.msg;
      } else if (typeof err === 'string') {
          errorMessage = err;
      } else if (err instanceof Error) { // Catch generic errors from context
          errorMessage = err.message;
      }
      setError(errorMessage);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop'; // Rice paddy field

  return (
    // Ensure this div takes full screen width and height
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center px-4 py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${backgroundImageUrl})`,
      }}
    >
      {/* Form Container */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50">
        <Logo />
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-md" role="alert">
              <p className="font-semibold">Lỗi Đăng Nhập</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {/* Email Input with Icon Inside */}
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
          {/* Password Input with Icon Inside */}
          <div className="relative rounded-lg border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition duration-150 ease-in-out">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Mật khẩu"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-end text-sm">
             {/* Pushed forgot password to the right */} 
            <div>
              <a href="#" className="font-medium text-green-600 hover:text-green-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // Nút đăng nhập
              className={`group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition duration-150 ease-in-out ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {!isLoading && <FiLogIn className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />}
              </span>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </button>
          </div>

          {/* Link to Register */}
          <div className="text-sm text-center text-gray-500 pt-4 border-t border-gray-200/80">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage; 