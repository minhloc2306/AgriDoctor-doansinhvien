import React, { useState, useEffect, Fragment } from 'react';
import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '../../services/categoryService'; // Adjust path if needed
import { Dialog, Transition } from '@headlessui/react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify'; // For displaying success/error messages
import 'react-toastify/dist/ReactToastify.css';

// Reusable Modal Component using Headless UI
const Modal = ({ isOpen, onClose, title, children }) => {
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-semibold leading-6 text-gray-900 flex justify-between items-center pb-4 border-b border-gray-200 mb-4"
                                >
                                    {title}
                                     <button 
                                        onClick={onClose} 
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                                        aria-label="Close modal"
                                    >
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

const ManageCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // General errors for fetching
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentCategory, setCurrentCategory] = useState(null); // Category being edited
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission/deletion

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState(null); // Form-specific errors

    // Fetch Categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            const errMsg = err.message || 'Không thể tải danh mục.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Modal Handling
    const openModal = (mode = 'add', category = null) => {
        setModalMode(mode);
        setCurrentCategory(category);
        setFormError(null);
        if (mode === 'edit' && category) {
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) return; // Prevent closing while submitting
        setIsModalOpen(false);
        setCurrentCategory(null);
        setName('');
        setDescription('');
        setFormError(null);
    };

    const openConfirmModal = (category) => {
        setCategoryToDelete(category);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        if (isSubmitting) return; // Prevent closing while submitting
        setIsConfirmModalOpen(false);
        setCategoryToDelete(null);
    };

    // Form Submission (Add/Edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);
        
        const categoryData = { name, description };

        try {
            let result;
            if (modalMode === 'add') {
                result = await addCategory(categoryData);
                // Add to list and sort alphabetically by name
                setCategories(prev => [...prev, result].sort((a, b) => a.name.localeCompare(b.name)));
                toast.success('Đã thêm danh mục thành công!');
            } else if (modalMode === 'edit' && currentCategory) {
                result = await updateCategory(currentCategory._id, categoryData);
                // Update list and sort alphabetically by name
                setCategories(prev => prev.map(cat => cat._id === currentCategory._id ? result : cat)
                                         .sort((a, b) => a.name.localeCompare(b.name)));
                toast.success('Đã cập nhật danh mục thành công!');
            }
            closeModal();
        } catch (err) {
            const errMsg = err.message || (Array.isArray(err.errors) ? err.errors.join(', ') : 'Thao tác thất bại.');
            setFormError(errMsg);
            // Don't necessarily show a toast here as the error is shown in the modal
        } finally {
             setIsSubmitting(false);
        }
    };

    // Delete Category
    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setIsSubmitting(true);
        
        try {
            await deleteCategory(categoryToDelete._id);
            setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
            toast.success(`Đã xóa danh mục "${categoryToDelete.name}" thành công!`);
            closeConfirmModal(); // Close modal on success
        } catch (err) {
            // Error shown via toast, don't necessarily set general page error
            toast.error(`Lỗi xóa danh mục: ${err.message || 'Thao tác thất bại'}`);
             // Optionally keep the confirm modal open on failure?
             // closeConfirmModal(); 
        } finally {
            setIsSubmitting(false);
            // Ensure categoryToDelete is cleared even on error if modal is closed
             if (!isConfirmModalOpen) {
                 setCategoryToDelete(null);
             }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800">Quản Lý Danh Mục Bệnh</h1>
                <button
                    onClick={() => openModal('add')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg inline-flex items-center transition duration-150 ease-in-out shadow hover:shadow-md"
                >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Thêm Mới
                </button>
            </div>

            {/* Loading State */}
            {isLoading && (
                 <div className="text-center py-10 text-gray-500">
                     <svg className="animate-spin h-6 w-6 text-green-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải danh mục...
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
            {!isLoading && !error && categories.length === 0 && (
                 <p className="text-center text-gray-500 py-10">Chưa có danh mục nào được tạo.</p>
             )}

            {/* Categories Table */}
            {!isLoading && !error && categories.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tên Danh Mục</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Mô Tả</th>
                                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{category.description || <span className="text-gray-400 italic">Không có mô tả</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button 
                                            onClick={() => openModal('edit', category)}
                                            className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 hover:bg-indigo-100 rounded-full"
                                            title="Chỉnh sửa"
                                        >
                                            <FiEdit size={18}/>
                                        </button>
                                        <button 
                                            onClick={() => openConfirmModal(category)}
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

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'Thêm Danh Mục Mới' : 'Chỉnh Sửa Danh Mục'}>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                     {formError && (
                        <p className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md">{formError}</p>
                     )}
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="category-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                        />
                    </div>
                    <div>
                        <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">Mô Tả</label>
                        <textarea
                            id="category-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                        />
                    </div>
                    <div className="pt-5 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                         <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={closeModal}
                            className={`inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang lưu...
                                </> 
                            ) : (modalMode === 'add' ? 'Thêm Mới' : 'Lưu Thay Đổi')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal */}
            <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} title="Xác Nhận Xóa Danh Mục">
                <p className="text-sm text-gray-600 mb-1">Bạn có chắc chắn muốn xóa danh mục:</p>
                <p className="text-md font-semibold text-gray-800 mb-4">{categoryToDelete?.name}</p>
                <p className="text-sm text-red-600">Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn danh mục.</p>
                 <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={closeConfirmModal}
                        className={`inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Hủy Bỏ
                    </button>
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                         {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xóa...
                            </> 
                         ) : 'Xác Nhận Xóa'}
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageCategoriesPage;
