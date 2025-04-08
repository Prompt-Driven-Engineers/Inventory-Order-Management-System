import { useState, useEffect, useContext } from "react";
import { ShoppingBag, PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        // console.log(UserID);
        axios.get(`http://localhost:8000/admins/adminDetails`, {
            withCredentials: true
        })
        .then((res) => {
            setAdmin(res.data); // Store only the response data
            console.log(res.data); // Log actual data
        })
        .catch((err) => {
            console.error("Error fetching admin:", err);
            setAdmin(null); // Ensure state is handled on error
        });
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-gray-200 p-6 flex flex-col items-start">
                {admin ? (
                    <>
                        {/* <p className="text-gray-700 font-semibold text-2xl">{admin.storename}</p> */}
                        <p className="text-gray-600">{admin.email}</p>
                        <p className="text-gray-600">{admin.phone}</p>
                        {/* <p className="text-gray-600 mt-10 font-semibold text-lg">Accout Details</p> */}
                        <p className="text-gray-600  ">Role: <span className="text-black font-semibold">{admin.Role}</span></p>
                        {/* <p className="text-gray-600 ">Permission: <span className="text-black font-semibold">{admin.permission}</span></p> */}
                    </>
                ) : (
                    <p>Loading admin details...</p> // Prevents error when admin is null
                )}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 bg-gray-100">
                {admin ? (<h1 className="text-2xl font-bold">Welcome, {admin.name}</h1>)
                : <h1 className="text-2xl font-bold">Welcome, </h1>
                }

                {/* Add Admins Button */}
                {admin?.Role === "SuperAdmin" && (
                    <div className="mt-6">
                        <div>
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
                        </div>
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
                        </div>
                        <div>
                            <h1>User Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    View User List
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    Modify User
                                </button>
                            </div>
                        </div>
                        <div>
                            <h1>Product Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => navigate('/allProducts')}
                                >
                                    View All Products
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    Remove Product
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    Seller Inventory
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    Categorize Product
                                </button>
                            </div>
                        </div>
                        <div>
                            <h1>Order Management</h1>
                            <div className="flex justify-around">
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    View All Orders
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {}}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    );
};