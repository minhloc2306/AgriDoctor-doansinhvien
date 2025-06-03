import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiDatabase, FiTag, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { getAllUsers } from '../../services/userService';
import { getAllDiseases } from '../../services/diseaseService';
import { getAllCategories } from '../../services/categoryService';
import { getAllFeedback } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';

// Stat Card Component
const StatCard = ({ title, value, icon, linkTo, bgColor = 'bg-blue-500', iconColor = 'text-blue-100' }) => (
    <div className={`rounded-lg shadow-md p-6 ${bgColor} text-white`}>
        <div className="flex items-center">
            <div className={`p-3 rounded-full ${iconColor} bg-white/20 mr-4`}>
                 {React.createElement(icon, { className: "h-6 w-6" })}
            </div>
            <div>
                <p className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</p>
                <p className="text-3xl font-semibold">{value}</p>
            </div>
        </div>
        {linkTo && (
            <Link 
                to={linkTo}
                className="block text-sm mt-4 opacity-90 hover:opacity-100 hover:underline inline-flex items-center"
            >
                Xem chi tiết <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
        )}
    </div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, diseases: 0, categories: 0, feedback: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch all data in parallel
                const [userData, diseaseData, categoryData, feedbackData] = await Promise.all([
                    getAllUsers(),
                    getAllDiseases(),
                    getAllCategories(),
                    getAllFeedback()
                ]);
                setStats({
                    users: userData.length,
                    diseases: diseaseData.length,
                    categories: categoryData.length,
                    feedback: feedbackData.length,
                    // Could add more specific counts, e.g., new feedback
                    // newFeedback: feedbackData.filter(f => f.status === 'new').length 
                });
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError('Không thể tải dữ liệu thống kê.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Bảng Điều Khiển</h1>
            <p className="text-gray-600 mb-8">Chào mừng trở lại, {user?.name || 'Admin'}!</p>

            {isLoading && <p className="text-gray-500">Đang tải thống kê...</p>}
            {error && <p className="text-red-500">Lỗi: {error}</p>}

            {!isLoading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Người Dùng" 
                        value={stats.users} 
                        icon={FiUsers} 
                        linkTo="/admin/users"
                        bgColor="bg-blue-500"
                        iconColor="text-blue-600"
                    />
                     <StatCard 
                        title="Danh Mục Bệnh" 
                        value={stats.categories} 
                        icon={FiTag} 
                        linkTo="/admin/categories"
                        bgColor="bg-purple-500"
                         iconColor="text-purple-600"
                    />
                    <StatCard 
                        title="Bệnh Đã Nhập" 
                        value={stats.diseases} 
                        icon={FiDatabase} 
                        linkTo="/admin/diseases"
                        bgColor="bg-green-500"
                         iconColor="text-green-600"
                    />
                     <StatCard 
                        title="Phản Hồi" 
                        value={stats.feedback} 
                        icon={FiMessageSquare} 
                        linkTo="/admin/feedback"
                        bgColor="bg-yellow-500"
                         iconColor="text-yellow-600"
                    />
                     {/* Add more StatCards here if needed, e.g., for newFeedback */}
                 </div>
            )}

            {/* Optionally, add recent activity or charts here */}
            {/* <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Hoạt động gần đây</h2>
                 {/* Display recent feedback, disease additions, etc. */} 
            {/* </div> */} 
        </div>
    );
};

export default AdminDashboard; 