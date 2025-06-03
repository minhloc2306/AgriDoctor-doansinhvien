import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiHome, // Dashboard
    FiDatabase, // Manage Diseases
    FiTag, // Manage Categories (Using FiTag as an example icon)
    FiMessageSquare, // Manage Feedback
    FiUsers, // Manage Users
    FiLogOut // Logout (can also be in header)
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed

const Sidebar = () => {
    const { logout } = useAuth();

    const baseLinkClass = "flex items-center px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-md transition duration-150 ease-in-out";
    const activeLinkClass = "bg-green-200 text-green-800 font-semibold";

    const getNavLinkClass = ({ isActive }) => 
        `${baseLinkClass} ${isActive ? activeLinkClass : ''}`;

    return (
        <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col z-40">
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
                 <span className="text-2xl font-bold text-green-700 tracking-tight">AgriDoctor</span>
                 {/* Or use an image logo */}
                 {/* <img src="/path/to/logo.png" alt="Logo" className="h-8 w-auto" /> */}
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                <NavLink to="/admin" end className={getNavLinkClass}>
                    <FiHome className="mr-3 h-5 w-5" />
                    <span>Tổng Quan</span>
                </NavLink>
                <NavLink to="/admin/categories" className={getNavLinkClass}>
                    <FiTag className="mr-3 h-5 w-5" />
                    <span>Quản Lý Danh Mục</span>
                </NavLink>
                <NavLink to="/admin/diseases" className={getNavLinkClass}>
                    <FiDatabase className="mr-3 h-5 w-5" />
                    <span>Quản Lý Bệnh</span>
                </NavLink>
                <NavLink to="/admin/feedback" className={getNavLinkClass}>
                    <FiMessageSquare className="mr-3 h-5 w-5" />
                    <span>Quản Lý Phản Hồi</span>
                </NavLink>
                 <NavLink to="/admin/users" className={getNavLinkClass}>
                    <FiUsers className="mr-3 h-5 w-5" />
                    <span>Quản Lý Người Dùng</span>
                </NavLink>
                {/* Add other admin links here */}
            </nav>

            {/* Optional: Logout button at the bottom of sidebar */}
             {/* <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0">
                <button 
                    onClick={logout} 
                    className={`${baseLinkClass} w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700`}
                >
                    <FiLogOut className="mr-3 h-5 w-5" />
                    <span>Đăng Xuất</span>
                </button>
            </div> */}
        </div>
    );
};

export default Sidebar; 