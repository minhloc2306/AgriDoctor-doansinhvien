import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const DiseaseCard = ({ disease }) => {
    if (!disease) return null; // Handle cases where disease might be undefined

    // Construct full image URL
    const backendBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const imagePath = disease.images?.[0];
    const imageUrl = imagePath ? `${backendBaseUrl}${imagePath}` : '/images/placeholder-plant.jpg';

    return (
        <Link 
            key={disease._id} 
            to={`/diseases/${disease._id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group"
        >
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                    src={imageUrl}
                    alt={disease.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { // Add onError handler back
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder-plant.jpg';
                    }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2 truncate group-hover:text-green-600">
                    {disease.name}
                </h3>
                {/* Optionally display category if available */}
                {/* {disease.category?.name && ( <p className="text-sm text-gray-500 mb-1">{disease.category.name}</p> )} */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {disease.symptoms}
                </p>
                <span className="text-green-600 group-hover:text-green-700 text-sm font-medium inline-flex items-center">
                    Xem chi tiết
                    <FiChevronRight className="ml-1 h-4 w-4" />
                </span>
            </div>
        </Link>
    );
};

export default DiseaseCard; 