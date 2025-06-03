import React, { useState, useEffect } from 'react';
import { getAllFeedback, updateFeedbackStatus, deleteFeedback } from '../../services/feedbackService';
import { toast } from 'react-toastify';
import { FiTrash2, FiEdit3, FiEye, FiMoreVertical, FiX } from 'react-icons/fi'; // Added FiX for close button

// Helper function to format dates (reuse from DiseaseDetailPage)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('vi-VN', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; 
    }
};

// Helper to map status values to readable text and colors
const statusMap = {
    new: { text: 'Mới', color: 'bg-blue-100 text-blue-800' },
    read: { text: 'Đã đọc', color: 'bg-yellow-100 text-yellow-800' },
    replied: { text: 'Đã trả lời', color: 'bg-green-100 text-green-800' },
    closed: { text: 'Đã đóng', color: 'bg-gray-100 text-gray-800' },
};

const ManageFeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch feedback data
    const fetchFeedback = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllFeedback();
            setFeedbackList(data || []);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError('Không thể tải danh sách phản hồi.');
            toast.error('Không thể tải danh sách phản hồi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    // --- Handler Functions --- 

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateFeedbackStatus(id, { status: newStatus });
            toast.success(`Đã cập nhật trạng thái phản hồi thành "${statusMap[newStatus]?.text || newStatus}".`);
            fetchFeedback(); // Refresh list
        } catch (err) {
            console.error("Error updating feedback status:", err);
            toast.error('Cập nhật trạng thái thất bại.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này không?')) {
            try {
                await deleteFeedback(id);
                toast.success('Đã xóa phản hồi thành công.');
                fetchFeedback(); // Refresh list
            } catch (err) {
                console.error("Error deleting feedback:", err);
                toast.error('Xóa phản hồi thất bại.');
            }
        }
    };

    // --- Render Logic --- 

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách phản hồi...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">Lỗi: {error}</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản Lý Phản Hồi</h1>

            {feedbackList.length === 0 ? (
                <p className="text-gray-500">Chưa có phản hồi nào.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người Gửi</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ Đề</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Gửi</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {feedbackList.map((feedback) => (
                                <tr key={feedback._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{feedback.name}</div>
                                        <div className="text-sm text-gray-500">{feedback.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <div className="text-sm text-gray-900 truncate max-w-xs">{feedback.subject}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(feedback.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[feedback.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {statusMap[feedback.status]?.text || feedback.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleViewDetails(feedback)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            title="Xem chi tiết"
                                        >
                                            <FiEye className="h-5 w-5" />
                                        </button>
                                        <select 
                                            value={feedback.status} 
                                            onChange={(e) => handleStatusUpdate(feedback._id, e.target.value)} 
                                            className="text-sm rounded border border-gray-300 p-1 mr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                             {Object.entries(statusMap).map(([key, { text }]) => (
                                                <option key={key} value={key}>{text}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => handleDelete(feedback._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Xóa"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- Inline Modal Implementation --- */}
            {isModalOpen && selectedFeedback && (
                // Overlay
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
                    onClick={() => setIsModalOpen(false)} // Close on overlay click
                >
                    {/* Modal Content Box */}
                    <div 
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                        // Remove animation classes: transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-start p-5 border-b rounded-t">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Chi tiết Phản hồi
                                </h3>
                                <p className="text-sm text-gray-500">Từ: {selectedFeedback.name} ({selectedFeedback.email})</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <FiX className="h-5 w-5" />
                                <span className="sr-only">Đóng modal</span>
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-700">Ngày gửi:</p>
                                    <p className="text-gray-600">{formatDate(selectedFeedback.createdAt)}</p>
                                </div>
                                 <div>
                                    <p className="font-semibold text-gray-700">Loại:</p>
                                    <p className="text-gray-600 capitalize">{selectedFeedback.type || 'General'}</p>
                                </div>
                            </div>
                             <div>
                                <p className="font-semibold text-gray-700 text-sm">Chủ đề:</p>
                                <p className="text-gray-800 text-base">{selectedFeedback.subject}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700 text-sm mb-1">Nội dung:</p>
                                <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap text-gray-700 text-sm max-h-60 overflow-y-auto">
                                    {selectedFeedback.message}
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                 <span className="font-semibold text-gray-700 text-sm">Trạng thái:</span>
                                 <select 
                                    value={selectedFeedback.status} 
                                    onChange={(e) => {
                                        handleStatusUpdate(selectedFeedback._id, e.target.value);
                                    }} 
                                    className={`text-xs font-semibold rounded-full border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusMap[selectedFeedback.status]?.color || 'bg-gray-100 text-gray-800'} border-transparent`}
                                >
                                     {Object.entries(statusMap).map(([key, { text }]) => (
                                        <option key={key} value={key}>{text}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                         <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Đóng
                            </button>
                        </div> 
                    </div>
                </div>
            )}
            {/* --- End Inline Modal --- */}
        </div>
    );
};

// Add keyframes for modal animation in your global CSS (e.g., index.css) if you want animation
/*
@keyframes modal-scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-modal-scale-in {
  animation: modal-scale-in 0.2s ease-out forwards;
}
*/

export default ManageFeedbackPage; 