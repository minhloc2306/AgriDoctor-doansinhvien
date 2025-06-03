import React, { useState, useEffect, Fragment } from 'react';
import {
    getAllUsers,
    updateUser,
    deleteUser
} from '../../services/userService'; // Adjust path if needed
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { FiEdit, FiTrash2, FiX, FiCheck, FiChevronDown } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext'; // To prevent deleting self

// Reusable Modal Component (can be extracted to a shared component)
const Modal = ({ isOpen, onClose, title, children }) => {
    // ... (Modal component code from ManageCategoriesPage - assuming it's here or imported)
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

const RoleMap = {
    admin: 'Quản Trị Viên',
    farmer: 'Nông Dân',
    student_lecturer: 'Sinh Viên/Giảng Viên'
};

const availableRoles = Object.keys(RoleMap);

const ManageUsersPage = () => {
    const { user: loggedInUser } = useAuth(); // Get the currently logged-in admin user
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State (for editing)
    const [selectedRole, setSelectedRole] = useState('');
    // Add other editable fields if needed (e.g., name)
    // const [name, setName] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            const errMsg = err.message || 'Không thể tải danh sách người dùng.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Edit Modal Handling
    const openEditModal = (user) => {
        setCurrentUser(user);
        setSelectedRole(user.role);
        // setName(user.name); // If editing name
        setFormError(null);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        if (isSubmitting) return;
        setIsEditModalOpen(false);
        setCurrentUser(null);
        setSelectedRole('');
        // setName('');
        setFormError(null);
    };

    // Confirmation Modal Handling
    const openConfirmModal = (user) => {
        if (user._id === loggedInUser._id) {
            toast.warn('Bạn không thể tự xóa tài khoản của mình.');
            return;
        }
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        if (isSubmitting) return;
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    // Form Submission (Edit User Role)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !selectedRole) return;
        setFormError(null);
        setIsSubmitting(true);
        
        const userData = { role: selectedRole };
        // if (name) userData.name = name; // If editing name

        try {
            const updatedUser = await updateUser(currentUser._id, userData);
            setUsers(users.map(u => u._id === currentUser._id ? updatedUser : u));
            toast.success(`Đã cập nhật vai trò cho ${updatedUser.name} thành công!`);
            closeEditModal();
        } catch (err) {
            const errMsg = err.message || (Array.isArray(err.errors) ? err.errors.join(', ') : 'Cập nhật thất bại.');
            setFormError(errMsg);
        } finally {
             setIsSubmitting(false);
        }
    };

    // Delete User
    const handleDelete = async () => {
        if (!userToDelete) return;
        setIsSubmitting(true);
        
        try {
            await deleteUser(userToDelete._id);
            setUsers(users.filter(u => u._id !== userToDelete._id));
            toast.success(`Đã xóa người dùng "${userToDelete.name}" thành công!`);
            closeConfirmModal();
        } catch (err) {
            toast.error(`Lỗi xóa người dùng: ${err.message || 'Thao tác thất bại'}`);
        } finally {
            setIsSubmitting(false);
             if (!isConfirmModalOpen) {
                 setUserToDelete(null);
             }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800">Quản Lý Người Dùng</h1>
                {/* Optional: Add User Button if admin can create users directly */}
                {/* <button
                    // onClick={() => openModal('add')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg inline-flex items-center transition duration-150 ease-in-out shadow hover:shadow-md"
                >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Thêm Người Dùng
                </button> */}
            </div>

            {/* Loading State */}
            {isLoading && (
                 <div className="text-center py-10 text-gray-500">
                     <svg className="animate-spin h-6 w-6 text-green-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                    Đang tải người dùng...
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
            {!isLoading && !error && users.length === 0 && (
                 <p className="text-center text-gray-500 py-10">Không có người dùng nào.</p>
             )}

            {/* Users Table */}
            {!isLoading && !error && users.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg overflow-x-auto border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Vai Trò</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Ngày Tham Gia</th>
                                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'student_lecturer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {RoleMap[user.role] || user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button 
                                            onClick={() => openEditModal(user)}
                                            className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 hover:bg-indigo-100 rounded-full"
                                            title="Chỉnh sửa vai trò"
                                        >
                                            <FiEdit size={18}/>
                                        </button>
                                        <button 
                                            onClick={() => openConfirmModal(user)}
                                            disabled={user._id === loggedInUser._id} // Disable delete for self
                                            className={`p-1 rounded-full transition duration-150 ease-in-out ${user._id === loggedInUser._id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800 hover:bg-red-100'}`}
                                            title={user._id === loggedInUser._id ? "Không thể xóa chính mình" : "Xóa người dùng"}
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

            {/* Edit User Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title={`Chỉnh Sửa Vai Trò: ${currentUser?.name}`}>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                     {formError && (
                        <p className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md">{formError}</p>
                     )}
                     {/* Add Name/Email fields here if needed */}
                     {/* <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                        <input id="user-name" value={name} onChange={...} ... />
                    </div> */} 
                    <div>
                        <Listbox value={selectedRole} onChange={setSelectedRole}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">Vai Trò</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{RoleMap[selectedRole] || 'Chọn vai trò'}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <FiChevronDown
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                                                {availableRoles.map((role) => (
                                                    <Listbox.Option
                                                        key={role}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-green-100 text-green-900' : 'text-gray-900'}`
                                                        }
                                                        value={role}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                                >
                                                                    {RoleMap[role]}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                                                        <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </> 
                            )}
                        </Listbox>
                    </div>
                   
                    <div className="pt-5 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                         <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={closeEditModal}
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
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                                    Đang lưu...
                                </> 
                            ) : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} title="Xác Nhận Xóa Người Dùng">
                <p className="text-sm text-gray-600 mb-1">Bạn có chắc chắn muốn xóa người dùng:</p>
                <p className="text-md font-semibold text-gray-800 mb-4">{userToDelete?.name} ({userToDelete?.email})</p>
                <p className="text-sm text-red-600">Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tài khoản người dùng.</p>
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
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
                                Đang xóa...
                            </> 
                         ) : 'Xác Nhận Xóa'}
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default ManageUsersPage; 