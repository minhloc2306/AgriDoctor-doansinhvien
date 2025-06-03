import React, { useState } from 'react';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Popover, Transition } from '@headlessui/react'; // Using Headless UI for dropdown
import { Fragment } from 'react';

const Header = ({ sidebarOpen, setSidebarOpen }) => { // Accept props to control mobile sidebar
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
            {/* Mobile Menu Button (visible on smaller screens) */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
                <span className="sr-only">Open sidebar</span>
                {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>

            {/* Placeholder for maybe breadcrumbs or search bar */} 
             <div className="flex-1 hidden md:block">
                {/* Add search or other header elements here if needed */}
             </div>

            {/* User Menu */}
            <div className="ml-auto flex items-center">
                <Popover className="relative">
                    {({
                        open
                    }) => (
                        <>
                            <Popover.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <span className="sr-only">Open user menu</span>
                                <FiUser className="h-8 w-8 rounded-full bg-gray-200 text-gray-600 p-1" /> {/* Placeholder Icon */}
                                <span className="hidden md:block ml-2 text-gray-700 text-sm font-medium">
                                    {user ? user.name : 'Admin'}
                                </span>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Popover.Panel className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    {/* <Popover.Button as="a" href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Popover.Button> */}
                                    {/* <Popover.Button as="a" href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Popover.Button> */}
                                    <Popover.Button 
                                        as="button"
                                        onClick={logout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <FiLogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Đăng Xuất
                                    </Popover.Button>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
        </header>
    );
};

export default Header; 