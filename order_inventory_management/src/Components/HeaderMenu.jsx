import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingCartIcon, 
    HeartIcon, 
    UserIcon, 
    ArrowRightOnRectangleIcon as LogoutIcon, 
    ArrowLeftOnRectangleIcon as LoginIcon, 
    MagnifyingGlassIcon as SearchIcon,
    ClipboardDocumentCheckIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/solid';
import SearchBar from './SearchBar';
import axios from "axios";

export default function HeaderMenu({isUserLoggedIn, isLoggedIn, user, setUser, setIsLoggedIn, isVendorLoggedIn}) {

    const [searchedProduct, setSearchedProduct] = useState('');
    const navigate = useNavigate();

    const handleLogout = async() => {
        try {
            await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
            setIsLoggedIn(false); // clear your app state
            setUser(null);
            navigate('/');   // optional redirect
            } catch (err) {
            console.error('Logout failed:', err);
            }
    }

    const fetchSearchedData = async() => {
        if(!searchedProduct) {
            return;
        }
    
        navigate(`/search/${searchedProduct}`);
    }

  return (
    <>
        <div className="box-border flex justify-around border border-gray-200 bg-gray-50 p-3 h-16 shadow-md">

            {/* Logo Section */}
            <div className="flex items-center">
                <div onClick={() => {navigate('/')}} className="flex items-center space-x-1 text-gray-900 font-bold text-2xl cursor-pointer">
                    <span className="text-blue-500">Secure</span>
                    <span className="text-green-500">Cart</span>
                </div>
            </div>

            {/* Enlarged Search Section */}
            {/* <div className="relative z-10"> */}
                <div className="flex w-full mx-4 md:mx-8">
                    {/* <div className="relative w-full">
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={onSuggestionSelected}
                        />
                    </div> */}
                    <SearchBar />

                    <button
                        // onClick={fetchSearchedData}
                        className="bg-blue-500 text-white p-2 px-3 rounded-r-lg hover:bg-blue-600 transition-all duration-300 flex items-center"
                    >
                        <SearchIcon className="h-5 w-5" />
                    </button>
                </div>
            {/* </div> */}


            {/* User and Logout Section */}
            <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                    <div className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-2xl cursor-pointer hover:bg-blue-600 transition-all duration-300">
                    <span className="text-sm font-medium">
                        {(user?.email?.slice(0, 1) || '').toUpperCase()}
                    </span>
                </div>
                
                ) : (
                    <div
                        onClick={() => { navigate('/userLogin'); }}
                        className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300"
                    >
                        <LoginIcon className="h-5 w-5 mr-2" />
                        Login
                    </div>
                )}

                {isLoggedIn && 
                    <div 
                        onClick={handleLogout} 
                        className="flex items-center bg-gray-300 text-gray-700 px-3 py-2 font-bold rounded-md cursor-pointer hover:bg-gray-400 transition-all duration-300"
                    >
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        Logout
                    </div>
                }

                {!isVendorLoggedIn && (
                    <div className="flex items-center  px-3 py-2 font-bold rounded-md cursor-pointer hover:bg-blue-300 transition-all duration-300">
                        <button onClick={() => { navigate('/sellerReg'); }}>
                            {/* <UserIcon className="h-5 w-5 mr-2" /> */}
                            Become a Seller
                        </button>
                    </div>
                )}
            </div>

            {/* Cart and Wishlist Section */}
            <div className="flex items-center space-x-4">
                {!isVendorLoggedIn && (
                    <>
                        <button 
                            onClick={() => { isUserLoggedIn ? navigate('/cart') : navigate('/customerLogin') }} 
                            className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-1" />
                            Cart
                        </button>
                        <button 
                            onClick={() => { isUserLoggedIn ? navigate('/wishlist') : navigate('/customerLogin') }} 
                            className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            <HeartIcon className="h-5 w-5 mr-1" />
                            Wishlist
                        </button>
                    </>
                )}

                {isVendorLoggedIn && (
                    <>
                        {shouldShowProducts && <button 
                            onClick={() => { navigate('/vendorDash'); }} 
                            className="flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            <ArchiveBoxIcon className="h-5 w-5 mr-1" />
                            Your Products
                        </button>}
                        <button 
                            // onClick={() => { navigate('/wishlist'); }} 
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
