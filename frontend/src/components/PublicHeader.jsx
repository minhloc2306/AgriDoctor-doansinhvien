import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To conditionally show Admin link
import { FiLogIn, FiUserPlus, FiHome, FiPhone, FiUserCheck, FiLogOut, FiShield } from 'react-icons/fi';

const PublicHeader = () => {
    const { isAuthenticated, user, logout } = useAuth();

    // Basic active style for NavLink
    const activeClassName = "text-green-600 font-semibold border-b-2 border-green-600";
    const baseClassName = "text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link to="/" className="text-2xl font-bold text-green-700 flex items-center">
                    {/* You can replace text with an actual logo img */}
                    <img src="/logo.png" alt="AgriDoctor Logo" className="h-8 w-auto mr-2" onError={(e) => e.target.style.display='none'} /> 
                    AgriDoctor
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-4">
                     <NavLink 
                        to="/"
                        className={({ isActive }) => `${baseClassName} ${isActive ? activeClassName : ''}`}
                    >
                        <FiHome className="inline mr-1 h-4 w-4"/> Trang Chủ
                    </NavLink>
                    <NavLink 
                        to="/contact"
                        className={({ isActive }) => `${baseClassName} ${isActive ? activeClassName : ''}`}
                    >
                       <FiPhone className="inline mr-1 h-4 w-4"/> Liên Hệ
                    </NavLink>
                    {/* Add more public links here if needed */} 
                </div>

                {/* Auth Links / User Info */}
                <div className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <>
                           {user?.role === 'admin' && (
                                <NavLink 
                                    to="/admin"
                                    className={({ isActive }) => `${baseClassName} ${isActive ? activeClassName : ''} flex items-center`}
                                >
                                    <FiShield className="mr-1 h-4 w-4"/> Quản trị
                                </NavLink>
                            )} 
                           <span className="text-gray-700 text-sm font-medium flex items-center">
                                <FiUserCheck className="mr-1 h-4 w-4 text-green-600"/> {user?.name}
                           </span>
                            <button 
                                onClick={logout}
                                className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
                                title="Đăng xuất"
                            >
                               <FiLogOut className="mr-1 h-4 w-4"/> Đăng Xuất
                           </button>
                        </>
                    ) : (
                        <>
                            <NavLink 
                                to="/login"
                                className={({ isActive }) => `${baseClassName} ${isActive ? activeClassName : ''} flex items-center`}
                            >
                                <FiLogIn className="mr-1 h-4 w-4"/> Đăng Nhập
                            </NavLink>
                            <NavLink 
                                to="/register"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
                            >
                                <FiUserPlus className="mr-1 h-4 w-4"/> Đăng Ký
                            </NavLink>
                        </>
                    )}
                    {/* Add mobile menu toggle here if needed */}
                </div>
            </nav>
        </header>
    );
};

export default PublicHeader; 