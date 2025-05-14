import { useState, useEffect } from "react";
import { PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { handleLogout } from "../apiCall/customer";
import { fetchAdminDetails } from "../apiCall/admin";

export default function AdminDashboard({ isLoggedIn, setUser, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        fetchAdminDetails(setAdmin);
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-gray-200 p-6 flex flex-col items-start">
                {admin ? (
                    <>
                        <p className="text-gray-600">{admin.email}</p>
                        <p className="text-gray-600">{admin.phone}</p>
                        <p className="text-gray-600  ">Role: <span className="text-black font-semibold">{admin.Role}</span></p>
                    </>
                ) : (
                    <p>Loading admin details...</p> // Prevents error when admin is null
                )}

                {/* Logout Button */}
                {isLoggedIn && (
                    <div
                        onClick={() => {
                            handleLogout(setIsLoggedIn, setUser, navigate);
                        }}
                        className="mt-6 flex items-center bg-red-100 text-red-600 px-3 py-2 font-semibold rounded-md cursor-pointer hover:bg-red-200 transition-all duration-300"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                    </div>
                )}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 bg-gray-100">
                {admin ? (<h1 className="text-2xl font-bold">Welcome, {admin.name}</h1>)
                    : <h1 className="text-2xl font-bold">Welcome, </h1>
                }

                {/* Add Admins Button */}
                <div className="mt-6">
                    {admin?.Role === "SuperAdmin" && <div>
                        <h1>Admin Management</h1>
                        <div className="flex justify-around">
                            <button
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => navigate('/adminReg')}
                            >
                                <PlusCircle size={20} /> Add New Admin
                            </button>
                            <button
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => navigate('/adminList')}
                            >
                                View Admin Details
                            </button>
                            <button
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => navigate('/modAdmin')}
                            >
                                Manage Admin
                            </button>
                        </div>
                    </div>}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Seller Administrator") &&
                        <div>
                            <h1>Seller Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => navigate('/pendingSellers')}
                                >
                                    Manage Sellers
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => navigate('/allSellerDetails')}
                                >
                                    View Seller Details
                                </button>
                            </div>
                        </div>}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Customer Support") &&
                        <div>
                            <h1>User Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    View User List
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    Modify User
                                </button>
                            </div>
                        </div>}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Inventory Administrator") &&
                        <div>
                            <h1>Product Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => navigate('/allProduct')}
                                >
                                    View All Products
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    Remove Product
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    Seller Inventory
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    Categorize Product
                                </button>
                            </div>
                        </div>}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Seller Administrator") &&
                        <div>
                            <h1>Order Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    View All Orders
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => { }}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    );
};