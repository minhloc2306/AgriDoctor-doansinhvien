import React, { useState, useEffect, Fragment } from 'react';
import {
    getAllDiseases,
    deleteDisease
} from '../../services/diseaseService';
import { getAllCategories } from '../../services/categoryService'; // Need categories for the form
import { Dialog, Transition } from '@headlessui/react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiImage, FiEye } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DiseaseForm from './DiseaseForm'; // Import the form component we will create

// Reusable Modal Component (can be extracted)
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
    };
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                 <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200`}>
                                 <Dialog.Title
                                    as="h3"
                                    className="text-xl font-semibold leading-6 text-gray-900 flex justify-between items-center pb-4 border-b border-gray-200 mb-4"
                                >
                                    {title}
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1" aria-label="Close modal">
                                        <FiX size={20} />
                                    </button>
                                </Dialog.Title>
                                <div className="mt-2">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Helper to get full image URL
const getImageUrl = (imagePath) => {
    // Assuming backend serves uploads from root and paths are stored like /uploads/filename.jpg
    // Adjust if your backend serves static files differently or if paths are stored differently
    const backendBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return imagePath ? `${backendBaseUrl}${imagePath}` : ''; // Handle cases where imagePath might be missing
};

const ManageDiseasesPage = () => {
    const [diseases, setDiseases] = useState([]);
    const [categories, setCategories] = useState([]); // Store categories for the form dropdown
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentDisease, setCurrentDisease] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [diseaseToDelete, setDiseaseToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // For form/delete operations

    // Fetch Initial Data (Diseases and Categories)
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [diseaseData, categoryData] = await Promise.all([
                getAllDiseases(),
                getAllCategories() // Fetch categories for the form
            ]);
            setDiseases(diseaseData);
            setCategories(categoryData);
        } catch (err) {
            const errMsg = err.message || 'Không thể tải dữ liệu ban đầu.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch only diseases after add/update/delete
    const refetchDiseases = async () => {
        // Optionally show a subtle loading state if needed
        try {
            const data = await getAllDiseases();
            setDiseases(data);
        } catch (err) {
             toast.error(err.message || 'Không thể làm mới danh sách bệnh.');
        }
    }

    // Modal Handling
    const openFormModal = (mode = 'add', disease = null) => {
        setModalMode(mode);
        setCurrentDisease(disease);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        if (isSubmitting) return; 
        setIsFormModalOpen(false);
        setCurrentDisease(null);
        // Form state reset happens inside DiseaseForm or on successful submit
    };

    const openConfirmModal = (disease) => {
        setDiseaseToDelete(disease);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        if (isSubmitting) return;
        setIsConfirmModalOpen(false);
        setDiseaseToDelete(null);
    };

    // Delete Disease
    const handleDelete = async () => {
        if (!diseaseToDelete) return;
        setIsSubmitting(true);
        
        try {
            await deleteDisease(diseaseToDelete._id);
            setDiseases(diseases.filter(dis => dis._id !== diseaseToDelete._id));
            toast.success(`Đã xóa bệnh "${diseaseToDelete.name}" thành công!`);
            closeConfirmModal();
        } catch (err) {
            toast.error(`Lỗi xóa bệnh: ${err.message || 'Thao tác thất bại'}`);
        } finally {
            setIsSubmitting(false);
             if (!isConfirmModalOpen) {
                 setDiseaseToDelete(null);
             }
        }
    };

    // Called from DiseaseForm on successful submission
    const handleFormSuccess = () => {
        closeFormModal();
        refetchDiseases(); // Refresh the list
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800">Quản Lý Bệnh</h1>
                 <button
                    onClick={() => openFormModal('add')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg inline-flex items-center transition duration-150 ease-in-out shadow hover:shadow-md"
                >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Thêm Bệnh Mới
                </button>
            </div>

            {/* Loading State */}
            {isLoading && (
                 <div className="text-center py-10 text-gray-500">
                      <svg className="animate-spin h-6 w-6 text-green-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                    Đang tải dữ liệu...
                </div>
             )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                    <strong className="font-bold">Lỗi!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && diseases.length === 0 && (
                 <p className="text-center text-gray-500 py-10">Chưa có thông tin bệnh nào.</p>
             )}

            {/* Diseases Table */}
            {!isLoading && !error && diseases.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tên Bệnh</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Danh Mục</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Triệu Chứng (ngắn)</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {diseases.map((disease) => (
                                <tr key={disease._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {disease.images && disease.images.length > 0 ? (
                                            <img 
                                                src={getImageUrl(disease.images[0])} 
                                                alt={disease.name} 
                                                className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <FiImage className="h-10 w-10 text-gray-300" /> // Placeholder icon
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{disease.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{disease.category?.name || <span className="text-gray-400 italic">N/A</span>}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={disease.symptoms}>{disease.symptoms}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        {/* Optional: View Details Button */}
                                        {/* <button 
                                            // onClick={() => openViewModal(disease)}
                                            className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out p-1 hover:bg-blue-100 rounded-full"
                                            title="Xem chi tiết"
                                        >
                                            <FiEye size={18}/>
                                        </button> */}
                                        <button 
                                            onClick={() => openFormModal('edit', disease)}
                                            className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 hover:bg-indigo-100 rounded-full"
                                            title="Chỉnh sửa"
                                        >
                                            <FiEdit size={18}/>
                                        </button>
                                        <button 
                                            onClick={() => openConfirmModal(disease)}
                                            className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out p-1 hover:bg-red-100 rounded-full"
                                            title="Xóa"
                                        >
                                            <FiTrash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal - Using DiseaseForm Component */}
            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={modalMode === 'add' ? 'Thêm Bệnh Mới' : 'Chỉnh Sửa Thông Tin Bệnh'} size="3xl"> { /* Larger modal for form */}
                <DiseaseForm 
                    mode={modalMode}
                    initialData={currentDisease}
                    categories={categories} // Pass categories down
                    onSubmitSuccess={handleFormSuccess} // Callback on success
                    onCancel={closeFormModal}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} title="Xác Nhận Xóa Bệnh">
                 <p className="text-sm text-gray-600 mb-1">Bạn có chắc chắn muốn xóa bệnh:</p>
                 <p className="text-md font-semibold text-gray-800 mb-4">{diseaseToDelete?.name}</p>
                 <p className="text-sm text-red-600">Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn thông tin bệnh (bao gồm cả hình ảnh).</p>
                 <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={closeConfirmModal}
                        className={`... (cancel button styling) ...`}
                    >
                        Hủy Bỏ
                    </button>
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className={`... (delete button styling) ...`}
                    >
                         {isSubmitting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageDiseasesPage; 