import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Static Sidebar for Desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                 <Sidebar />
            </div>

            {/* Mobile Sidebar (Conditional Rendering or Off-canvas) */}
            {/* Basic example: Show/Hide based on state */}
            {sidebarOpen && (
                 <div className="md:hidden fixed inset-0 flex z-40">
                     {/* Sidebar */} 
                     <div className="w-64">
                         <Sidebar />
                     </div>
                     {/* Overlay to close sidebar */} 
                     <div className="flex-1 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                 </div>
             )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
                {/* Header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 mt-16"> { /* mt-16 to offset fixed header */}
                    <div className="container mx-auto px-6 py-8">
                        <Outlet /> { /* Nested admin pages render here */ }
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 