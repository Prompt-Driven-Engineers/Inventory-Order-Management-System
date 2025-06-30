import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ShoppingCartIcon,
    ArrowLeftOnRectangleIcon as LoginIcon,
    ClipboardDocumentCheckIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/solid';
import SearchBar from './SearchBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HeaderMenu({ isLoggedIn, user, isVendorLoggedIn }) {

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path) => {
        if(location.pathname !== path) navigate(path);
    }

    return (
        <>
            <div className="fixed w-screen z-50 box-border flex justify-around border border-gray-200 bg-gray-50 p-3 h-16 shadow-md">

                {/* Logo Section */}
                <div className="flex items-center">
                    <div onClick={() => handleNavigate('/')} className="flex items-center space-x-1 text-gray-900 font-bold text-2xl cursor-pointer">
                        <span className="text-blue-500">Secure</span>
                        <span className="text-green-500">Cart</span>
                    </div>
                </div>
                <div className="flex w-full max-w-1/2 mx-4 md:mx-8">
                    <SearchBar />
                </div>

                {/* User and Logout Section */}
                <div className="flex items-center space-x-2">
                    {user?.role !== 'Seller' && (
                        <div className="flex items-center  px-3 py-2 font-bold rounded-md cursor-pointer hover:bg-blue-300 transition-all duration-300">
                            <button onClick={() => handleNavigate('/sellerReg')}>
                                {/* <UserIcon className="h-5 w-5 mr-2" /> */}
                                Become a Seller
                            </button>
                        </div>
                    )}
                    {isLoggedIn ? (
                        <div 
                            className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-2xl cursor-pointer hover:bg-blue-600 transition-all duration-300"
                            onClick={() => {
                                if(user.role === 'Customer') handleNavigate('/customerDash');
                                else if(user.role === 'Seller') handleNavigate('/sellerDash');
                                else if(user.role === 'Admin') handleNavigate('/adminDash');
                            }}
                        >
                            <span className="text-sm font-medium">
                                {(user?.email?.slice(0, 1) || '').toUpperCase()}
                            </span>
                        </div>

                    ) : (
                        <div
                            onClick={() => handleNavigate('/userLogin')}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300"
                        >
                            <LoginIcon className="h-5 w-5 mr-2" />
                            Login
                        </div>
                    )}
                </div>

                {/* Cart and Wishlist Section */}
                <div className="flex items-center space-x-4">
                    {(user?.role !== 'Admin' && user?.role !== 'Seller') && (
                        <>
                            <button
                                onClick={() => { handleNavigate('/cart'); }}
                                className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                            >
                                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                                Cart
                            </button>
                        </>
                    )}

                    {user?.role === 'Seller' && (
                        <>
                            <button
                                onClick={() => handleNavigate('/sellerDash')}
                                className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                            >
                                <ArchiveBoxIcon className="h-5 w-5 mr-1" />
                                Your Products
                            </button>
                            <button
                                onClick={() => handleNavigate('/sellerOrders')}
                                className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                            >
                                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1" />
                                Orders
                            </button>
                        </>
                    )}
                </div>
            </div>

        </>
    )
}
