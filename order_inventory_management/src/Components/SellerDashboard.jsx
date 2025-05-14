import { useState, useEffect, useContext } from "react";
import { ShoppingBag, PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { handleLogout } from "../apiCall/customer";

export default function SellerDashboard({isLoggedIn, setUser, setIsLoggedIn}) {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [stock, setStock] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);

    useEffect(() => {
        // console.log(UserID);
        axios.get(`http://localhost:8000/sellers/sellerDetails`, {
            withCredentials: true
        })
            .then((res) => {
                setSeller(res.data);
                console.log(res.data); 
            })
            .catch((err) => {
                console.error("Error fetching seller:", err);
                setSeller(null); 
            });
    }, []);


    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="lg:w-1/4 w-full bg-white p-6 shadow-md flex flex-col justify-between">
            {seller ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Seller Info</h2>
                    <p className="text-gray-600"><strong>Name:</strong> {seller.name}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {seller.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {seller.phone}</p>
                    <p className="text-gray-600 mt-10 font-semibold text-lg">Accout Details</p>
                    <p className="text-gray-600  ">Account no: <span className="text-black font-semibold">{seller.accountno}</span></p>
                    <p className="text-gray-600 ">IFSC code: <span className="text-black font-semibold">{seller.ifsc}</span></p>
                </div>
                ) : (
                    <p>Loading seller details...</p> // ✅ Prevents error when seller is null
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
                {seller ? (<h1 className="text-2xl font-bold">Welcome, {seller.name}</h1>)
                : <h1 className="text-2xl font-bold">Welcome, </h1>
                }

                {/* Stock Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShoppingBag size={20} /> Your Stock
                    </h2>
                    <ul className="mt-3">
                        {stock.length > 0 ? (
                            stock.map((product, index) => (
                                <li key={index} className="border-b py-2">
                                    {product.name} - {product.quantity} pcs
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No products in stock</p>
                        )}
                    </ul>
                </div>

                {/* Sold Products Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShoppingBag size={20} /> Sold Products
                    </h2>
                    <ul className="mt-3">
                        {soldProducts.length > 0 ? (
                            soldProducts.map((product, index) => (
                                <li key={index} className="border-b py-2">
                                    {product.name} - {product.quantity} sold
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No products sold yet</p>
                        )}
                    </ul>
                </div>

                {/* Add Product Button */}
                <div className="mt-6">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => navigate('/searchProduct')}
                    >
                        <PlusCircle size={20} /> Add Product
                    </button>
                </div>
                {/* Add Product Button */}
                <div className="mt-6">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => navigate('/addProduct')}
                    >
                        <PlusCircle size={20} /> Add New Product
                    </button>
                </div>
            </div>
        </div>
    );
};