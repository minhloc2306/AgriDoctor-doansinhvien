import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllDiseases } from '../services/diseaseService';
import { FiSearch, FiChevronRight, FiCamera, FiDatabase, FiAward, FiUsers } from 'react-icons/fi';
import DiseaseCard from '../components/DiseaseCard';

const HomePage = () => {
    const [diseases, setDiseases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchInitialDiseases = async () => {
            try {
                const data = await getAllDiseases();
                if (isMounted) {
                    setDiseases(data || []);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching diseases:", err);
                    setError('Không thể tải danh sách bệnh. Vui lòng thử lại sau.');
                    setIsLoading(false);
                }
            }
        };

        fetchInitialDiseases();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredDiseases = useMemo(() => {
        if (!searchTerm.trim()) return diseases;
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return diseases.filter(disease => 
            disease.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (disease.symptoms && disease.symptoms.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (disease.description && disease.description.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [searchTerm, diseases]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-green-700 text-white">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=60" 
                        alt="Rice Field" 
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">AgriDoctor - Chẩn Đoán Bệnh Cây Lúa</h1>
                        <p className="text-xl md:text-2xl mb-8 text-green-100">
                            Giải pháp thông minh giúp bạn nhận diện và điều trị bệnh cho cây lúa một cách hiệu quả
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link 
                                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition duration-300"
                            >
                                Chẩn Đoán Ngay
                            </Link>
                            <Link 
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition duration-300"
                            >
                                Tìm Hiểu Thêm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Tính Năng Nổi Bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCamera className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Nhận Diện Hình Ảnh</h3>
                            <p className="text-gray-600">Chẩn đoán bệnh qua hình ảnh với độ chính xác cao</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiDatabase className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Cơ Sở Dữ Liệu</h3>
                            <p className="text-gray-600">Thông tin đầy đủ về các loại bệnh phổ biến</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAward className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Độ Chính Xác Cao</h3>
                            <p className="text-gray-600">Kết quả chẩn đoán với độ tin cậy cao</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUsers className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Cộng Đồng</h3>
                            <p className="text-gray-600">Chia sẻ và học hỏi từ cộng đồng nông dân</p>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* Search and Disease List Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tra Cứu Bệnh Lúa</h2>
                <p className="text-center text-gray-600 mb-8">Tìm kiếm thông tin về các loại bệnh thường gặp trên cây lúa</p>

                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Nhập tên bệnh hoặc triệu chứng..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {isLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                )}
                
                {error && !isLoading && (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                
                {!isLoading && !error && (
                    filteredDiseases.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDiseases.map((disease) => (
                                <DiseaseCard key={disease._id} disease={disease} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-10">
                            {searchTerm 
                                ? 'Không tìm thấy bệnh nào phù hợp với từ khóa tìm kiếm.' 
                                : 'Không có dữ liệu bệnh nào.'
                            }
                        </p>
                    )
                )}
            </div>

            {/* Statistics Banner */}
            <div className="bg-green-700 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-green-100">Mẫu bệnh đã phân tích</div>
                        </div>
                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2">95%</div>
                            <div className="text-green-100">Độ chính xác</div>
                        </div>
                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2">5000+</div>
                            <div className="text-green-100">Người dùng tin tưởng</div>
                        </div>
                        <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2">20+</div>
                            <div className="text-green-100">Giống lúa được hỗ trợ</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage; 