import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Using react-hook-form for easier handling
import { addDisease, updateDisease } from '../../services/diseaseService';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify'; // Import toast

// Helper to get full image URL (ensure consistency or extract to utils)
const getImageUrl = (imagePath) => {
    const backendBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return imagePath ? `${backendBaseUrl}${imagePath}` : '';
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const MAX_FILES = 5;

const DiseaseForm = ({ mode = 'add', initialData = null, categories = [], onSubmitSuccess, onCancel }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: mode === 'edit' && initialData ? {
            name: initialData.name,
            description: initialData.description,
            symptoms: initialData.symptoms,
            causes: initialData.causes || '',
            prevention: initialData.prevention,
            treatment: initialData.treatment,
            categoryId: initialData.category?._id || '' // Use category ID
        } : {
             causes: '' // Ensure causes has a default empty string
        }
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImagePaths, setExistingImagePaths] = useState([]); // Paths of images already on the server
    const [newImageFiles, setNewImageFiles] = useState([]); // File objects for new uploads
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Populate form and previews when editing
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                name: initialData.name,
                description: initialData.description,
                symptoms: initialData.symptoms,
                causes: initialData.causes || '',
                prevention: initialData.prevention,
                treatment: initialData.treatment,
                categoryId: initialData.category?._id || ''
            });
            if (initialData.images && initialData.images.length > 0) {
                const currentImagePaths = initialData.images;
                setExistingImagePaths(currentImagePaths);
                setImagePreviews(currentImagePaths.map(path => getImageUrl(path)));
            } else {
                setExistingImagePaths([]);
                setImagePreviews([]);
            }
            setNewImageFiles([]); // Reset new files when editing
        } else {
            // Reset everything for add mode or if initialData is null
            reset({ name: '', description: '', symptoms: '', causes: '', prevention: '', treatment: '', categoryId: '' });
            setExistingImagePaths([]);
            setImagePreviews([]);
            setNewImageFiles([]);
        }
    }, [mode, initialData, reset]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        // Kiểm tra số lượng ảnh tối đa
        if (imagePreviews.length + files.length > MAX_FILES) {
            toast.error(`Chỉ được phép tải lên tối đa ${MAX_FILES} ảnh`);
            return;
        }

        const currentPreviews = [...imagePreviews];
        const currentNewFiles = [...newImageFiles];
        let hasError = false;

        files.forEach(file => {
            // Kiểm tra định dạng file
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                toast.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận JPG, PNG, GIF`);
                hasError = true;
                return;
            }

            // Kiểm tra kích thước file
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} vượt quá 5MB`);
                hasError = true;
                return;
            }

            currentPreviews.push(URL.createObjectURL(file));
            currentNewFiles.push(file);
        });

        if (!hasError) {
            setImagePreviews(currentPreviews);
            setNewImageFiles(currentNewFiles);
        }
        
        event.target.value = null;
    };

    // Thêm hàm để xem ảnh full size
    const handleImageClick = (imageUrl) => {
        window.open(imageUrl, '_blank');
    };

    // Function to remove an image (handles both existing and new previews)
    const removeImage = (indexToRemove) => {
        const previewToRemove = imagePreviews[indexToRemove];
        
        // Check if it's an existing image by seeing if its URL matches an existing path's URL
        const existingIndex = existingImagePaths.findIndex(path => getImageUrl(path) === previewToRemove);
        
        if (existingIndex > -1) {
            // Removing an existing image - remove its path
            setExistingImagePaths(prev => prev.filter((_, idx) => idx !== existingIndex));
        } else {
             // Removing a newly added image - remove its File object and revoke its URL
            const newFileIndex = imagePreviews.slice(0, indexToRemove)
                                            .filter(url => !existingImagePaths.some(path => getImageUrl(path) === url))
                                            .length;
            setNewImageFiles(prev => prev.filter((_, idx) => idx !== newFileIndex));
            URL.revokeObjectURL(previewToRemove); 
        }
        
        // Update previews
        setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const onSubmit = async (data) => {
        setFormError(null);
        setIsSubmitting(true);

        const formData = new FormData();
        // Append text data
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        // Append existing image paths (to tell backend which ones to keep)
        // Backend needs to be configured to look for `existingImages[]`
         existingImagePaths.forEach(path => {
            formData.append('existingImages', path);
        });
        // If existingImagePaths is empty after removals, explicitly signal to backend (optional, depends on backend logic)
        // if (existingImagePaths.length === 0 && mode === 'edit' && initialData?.images?.length > 0) {
        //     formData.append('existingImages', ''); // Send empty value if all were removed
        // }

        // Append new image files
        newImageFiles.forEach(file => {
            formData.append('images', file); // Backend expects field named 'images'
        });

        try {
            if (mode === 'add') {
                await addDisease(formData);
                toast.success('Đã thêm bệnh thành công!');
            } else if (mode === 'edit' && initialData) {
                await updateDisease(initialData._id, formData);
                toast.success('Đã cập nhật bệnh thành công!');
            }
            onSubmitSuccess(); // Call the success callback from parent
        } catch (err) {
            const errMsg = err.message || (Array.isArray(err.errors) ? err.errors.join(', ') : 'Thao tác thất bại.');
            setFormError(errMsg);
            toast.error(`Lỗi: ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formError && (
                 <p className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-md">{formError}</p>
            )}
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Bệnh <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="name"
                        {...register("name", { required: "Tên bệnh là bắt buộc" })}
                        className={`block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>
                 <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Danh Mục <span className="text-red-500">*</span></label>
                    <select
                        id="categoryId"
                        {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
                        className={`block w-full px-3 py-2 border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                    >
                        <option value="">-- Chọn Danh Mục --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                     {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
                </div>
            </div>
            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô Tả <span className="text-red-500">*</span></label>
                <textarea
                    id="description"
                    rows={3}
                    {...register("description", { required: "Mô tả là bắt buộc" })}
                     className={`block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                />
                 {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
            </div>

            <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">Triệu Chứng <span className="text-red-500">*</span></label>
                <textarea
                    id="symptoms"
                    rows={4}
                    {...register("symptoms", { required: "Triệu chứng là bắt buộc" })}
                    className={`block w-full px-3 py-2 border ${errors.symptoms ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                />
                 {errors.symptoms && <p className="mt-1 text-xs text-red-600">{errors.symptoms.message}</p>}
            </div>

             <div>
                <label htmlFor="causes" className="block text-sm font-medium text-gray-700 mb-1">Nguyên Nhân</label>
                <textarea
                    id="causes"
                    rows={3}
                    {...register("causes")}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                />
            </div>

            <div>
                <label htmlFor="prevention" className="block text-sm font-medium text-gray-700 mb-1">Phòng Ngừa <span className="text-red-500">*</span></label>
                <textarea
                    id="prevention"
                    rows={4}
                    {...register("prevention", { required: "Cách phòng ngừa là bắt buộc" })}
                     className={`block w-full px-3 py-2 border ${errors.prevention ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                 />
                 {errors.prevention && <p className="mt-1 text-xs text-red-600">{errors.prevention.message}</p>}
            </div>

             <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">Điều Trị <span className="text-red-500">*</span></label>
                <textarea
                    id="treatment"
                    rows={4}
                    {...register("treatment", { required: "Cách điều trị là bắt buộc" })}
                    className={`block w-full px-3 py-2 border ${errors.treatment ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out`}
                 />
                 {errors.treatment && <p className="mt-1 text-xs text-red-600">{errors.treatment.message}</p>}
            </div>

            {/* Image Upload Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình Ảnh ({imagePreviews.length}/{MAX_FILES})
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                                <span>Tải lên file</span>
                                <input 
                                    id="file-upload" 
                                    name="images" 
                                    type="file" 
                                    className="sr-only" 
                                    multiple 
                                    accept=".jpg,.jpeg,.png,.gif"
                                    onChange={handleImageChange}
                                    disabled={imagePreviews.length >= MAX_FILES}
                                />
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF tối đa 5MB mỗi ảnh. Tối thiểu 1 ảnh, tối đa {MAX_FILES} ảnh.
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Xem trước hình ảnh:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imagePreviews.map((previewUrl, index) => (
                            <div key={index} className="relative group">
                                <div 
                                    className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 cursor-pointer"
                                    onClick={() => handleImageClick(previewUrl)}
                                >
                                    <img 
                                        src={previewUrl} 
                                        alt={`Preview ${index + 1}`} 
                                        className="object-cover w-full h-full group-hover:opacity-75 transition-opacity duration-150"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-600/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                                    title="Xóa ảnh"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Form Actions */}
            <div className="pt-5 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                 <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onCancel} // Use onCancel from props
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
                            Đang xử lý...
                        </> 
                    ) : (mode === 'add' ? 'Thêm Bệnh Mới' : 'Lưu Thay Đổi')}
                </button>
            </div>
        </form>
    );
};

export default DiseaseForm; 