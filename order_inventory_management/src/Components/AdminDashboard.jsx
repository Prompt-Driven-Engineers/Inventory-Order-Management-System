import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import LeftSidebar from "./LeftSidebar";
import { fetchAdminDetails } from "../apiCall/admin";

export default function AdminDashboard({ isLoggedIn, setUser, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        fetchAdminDetails(setAdmin);
    }, []);

    const statusColor = {
        Active: 'text-green-600',
        Inactive: 'text-yellow-500',
        Suspended: 'text-red-600'
    };

    if(admin && admin.AccountStatus !== 'Active')

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <LeftSidebar setIsLoggedIn={setIsLoggedIn} setUser={setUser} navigate={navigate} isLoggedIn={isLoggedIn}>
                {admin ? (
                    <div className="space-y-4">
                        <p className="text-gray-600"><strong>Name:</strong> {admin.name}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {admin.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {admin.phone}</p>
                    <p className="text-gray-600"><strong>Role:</strong> {admin.Role}</p>
                    Account Status: <span className={`text-md font-medium ${statusColor[admin.AccountStatus] || 'text-gray-500'}`}>
                        {admin.AccountStatus}
                    </span>
                    </div>
                ) : (
                    <p>Loading admin details...</p> // Prevents error when admin is null
                )}
            </LeftSidebar>

            {/* Right Content Area */}
            {(admin && admin.AccountStatus === 'Active') ? <div className="ml-0 sm:ml-[25%] flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome, {admin?.name || ""}
                </h1>

                {/* Admin Controls */}
                <div className="space-y-10">
                    {admin?.Role === "SuperAdmin" && 
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            <div
                                onClick={() => {navigate('/reorderList')}}
                                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Reorder Alearts
                            </div>
                            <div
                                onClick={() => {navigate('/sellsList')}}
                                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Sells Dashboard
                            </div>
                        </div>
                    }
                    {/* Admin Management */}
                    {admin?.Role === "SuperAdmin" && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Admin Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => navigate('/adminReg')}
                                >
                                    <PlusCircle size={20} /> Add New Admin
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => navigate('/adminList')}
                                >
                                    View Admin Details
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => navigate('/modAdmin')}
                                >
                                    Manage Admin
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Seller Management */}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Seller Administrator") && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700">Seller Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={() => navigate('/pendingSellers')}
                                >
                                    Manage Sellers
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={() => navigate('/allSellerDetails')}
                                >
                                    View Seller Details
                                </button>
                            </div>
                        </section>
                    )}

                    {/* User Management */}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Customer Support") && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-purple-700">User Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                    onClick={() => navigate('/allCustomers')}
                                >
                                    View User List
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                    onClick={() => navigate('/allCustomers')}
                                >
                                    Modify User
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Product Management */}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Inventory Administrator") && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Product Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <button
                                    className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                                    onClick={() => navigate('/allProduct')}
                                >
                                    Manage Products
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                                    onClick={() => { navigate('/sellerInventory')}}
                                >
                                    Seller Inventory
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                                    onClick={() => { }}
                                >
                                    Categorize Product
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Order Management */}
                    {(admin?.Role === "SuperAdmin" || admin?.Role === "Seller Administrator") && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-red-700">Order Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                                    onClick={() => { navigate('/ordersPage')}}
                                >
                                    View All Orders
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                                    onClick={() => { }}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
            : <div className="ml-0 sm:ml-[25%] p-4 flex items-center justify-center text-red-400 text-xl">Your account is {admin.AccountStatus}. Contact Admin</div>}
        </div>
    );
};