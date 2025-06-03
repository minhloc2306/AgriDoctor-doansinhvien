import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiseaseById } from '../services/diseaseService'; // Assuming public access
import { FiArrowLeft, FiTag, FiUser, FiCalendar, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Helper function to format dates (optional)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('vi-VN', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            // hour: '2-digit', minute: '2-digit' // Uncomment for time
        }).format(new Date(dateString));
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Fallback to original string
    }
};

const ImageViewer = ({ images, onClose, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            >
                <FiX size={24} />
            </button>
            
            <button
                onClick={handlePrevious}
                className="absolute left-4 text-white hover:text-gray-300 focus:outline-none"
            >
                <FiChevronLeft size={40} />
            </button>

            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <button
                onClick={handleNext}
                className="absolute right-4 text-white hover:text-gray-300 focus:outline-none"
            >
                <FiChevronRight size={40} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

const DiseaseDetailPage = () => {
    const { id } = useParams(); // Get disease ID from URL
    const [disease, setDisease] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchDisease = async () => {
            setIsLoading(true);
            setError(null);
            if (!id) {
                if (isMounted) {
                    setError('Không tìm thấy ID bệnh.');
                    setIsLoading(false);
                }
                return;
            }
            try {
                // TODO: Confirm if getDiseaseById needs a separate public version
                const data = await getDiseaseById(id); 
                if (isMounted) setDisease(data);
            } catch (err) {
                if (isMounted) {
                    console.error(`Error fetching disease ${id}:`, err);
                    setError('Không thể tải thông tin bệnh. Có thể bệnh không tồn tại hoặc đã xảy ra lỗi.');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchDisease();
        return () => { isMounted = false; };
    }, [id]);

    // Get full image URLs
    const backendBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const imageUrls = disease?.images?.map(path => `${backendBaseUrl}${path}`) || [];

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/placeholder-plant.jpg';
    };

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải thông tin bệnh...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">Lỗi: {error}</p>;
    }

    if (!disease) {
        return <p className="text-center text-gray-500 py-10">Không tìm thấy thông tin cho bệnh này.</p>;
    }

    // Helper to safely render HTML content
    const createMarkup = (htmlContent) => {
      // Basic sanitization (consider a library like DOMPurify for robust sanitization)
      const sanitizedContent = htmlContent?.replace(/<script.*?>.*?<\/script>/gi, '');
      return { __html: sanitizedContent || '' };
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Quay lại danh sách
            </Link>

            <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Image Gallery */}
                {imageUrls.length > 0 && (
                    <div className="relative">
                        {/* Main Image */}
                        <div className="w-full h-[400px] bg-gray-100">
                            <img 
                                src={imageUrls[0]}
                                alt={disease.name}
                                className="w-full h-full object-contain cursor-pointer"
                                onClick={() => setSelectedImageIndex(0)}
                                onError={handleImageError}
                            />
                        </div>

                        {/* Thumbnail Strip */}
                        {imageUrls.length > 1 && (
                            <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
                                {imageUrls.map((url, index) => (
                                    <div 
                                        key={index}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                                            index === 0 ? 'border-green-500' : 'border-transparent hover:border-green-300'
                                        }`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img
                                            src={url}
                                            alt={`${disease.name} - Ảnh ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">{disease.name}</h1>
                    
                    {disease.category && (
                        <div className="mb-6">
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                <FiTag className="mr-1.5 h-4 w-4" />
                                {disease.category.name} 
                            </span>
                        </div>
                    )}

                    <div className="prose prose-green max-w-none">
                        {/* Description Section */}
                        {disease.description && (
                            <>
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">Mô Tả</h2>
                                <div dangerouslySetInnerHTML={createMarkup(disease.description)}></div>
                            </>
                        )}

                        {/* Symptoms Section */}
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Triệu Chứng</h2>
                        <div dangerouslySetInnerHTML={createMarkup(disease.symptoms)}></div>

                        {/* Causes Section - Use disease.causes */}
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Nguyên Nhân</h2>
                        <div dangerouslySetInnerHTML={createMarkup(disease.causes)}></div>

                        {/* Prevention Section */}
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Biện Pháp Phòng Ngừa</h2>
                        <div dangerouslySetInnerHTML={createMarkup(disease.prevention)}></div>

                        {/* Treatment Section */}
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Biện Pháp Điều Trị</h2>
                        <div dangerouslySetInnerHTML={createMarkup(disease.treatment)}></div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-2">
                        {disease.createdBy?.name && (
                            <div className="flex items-center">
                                <FiUser className="mr-2 h-4 w-4" />
                                <span>Người tạo: {disease.createdBy.name}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                             <FiCalendar className="mr-2 h-4 w-4" />
                            <span>Ngày tạo: {formatDate(disease.createdAt)}</span>
                        </div>
                         <div className="flex items-center">
                            <FiCalendar className="mr-2 h-4 w-4" />
                            <span>Cập nhật lần cuối: {formatDate(disease.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </article>

            {/* Image Viewer Modal */}
            {selectedImageIndex !== null && (
                <ImageViewer
                    images={imageUrls}
                    initialIndex={selectedImageIndex}
                    onClose={() => setSelectedImageIndex(null)}
                />
            )}
        </div>
    );
};

export default DiseaseDetailPage; 