import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader'; // We'll create this next
import PublicFooter from '../components/PublicFooter'; // We'll create this next
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow py-8">
        <Outlet /> {/* Renders the matched child route component */}
      </main>
      <PublicFooter />
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />
    </div>
  );
};

export default PublicLayout; 