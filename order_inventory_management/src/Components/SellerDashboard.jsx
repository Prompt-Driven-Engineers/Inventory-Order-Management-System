import { useState, useEffect, useContext } from "react";
import { ShoppingBag, PlusCircle, Eye  } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LeftSidebar from "./LeftSidebar";
import { getFirstImage } from "../functions/func";
import { showConfirmToast } from "./ShowConfirmToast";
import { toast } from "react-toastify";

export default function SellerDashboard({isLoggedIn, setUser, setIsLoggedIn}) {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [stock, setStock] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);

    useEffect(() => {
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

    useEffect(() => {
        axios.get(`http://localhost:8000/sellers/sellerInventory`, {
            withCredentials: true
        })
        .then((res) => {
            setStock(res.data);
            console.log(res.data); 
        })
        .catch((err) => {
            console.error("Error fetching seller:", err);
            setStock(null); 
        });
    }, []);

    const handleRemoveInventory = async (sellerInventoryId, productName) => {
        showConfirmToast({
            message: `Are you sure you want to remove ${productName}?`,
            onConfirm: () => {
                axios.delete(`http://localhost:8000/sellers/removeFromInventory/${sellerInventoryId}`, {
                    withCredentials: true
                })
                .then((res) => {
                    setStock((prevStock) =>
                        prevStock.filter(item => item.SellerInventoryID !== sellerInventoryId)
                    );
                    toast.success("Product removed successfully");
                })
                .catch((err) => {
                    console.error("Error removing product:", err);
                    toast.error(
                        err.response?.data?.message || "Failed to remove product"
                    );
                });
            }
        });
    };

    const statusColor = {
        Active: 'text-green-600',
        Pending: 'text-yellow-500',
        Suspended: 'text-red-600'
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side bar */}
            <LeftSidebar setIsLoggedIn={setIsLoggedIn} setUser={setUser} navigate={navigate} isLoggedIn={isLoggedIn}>
                {seller ? (
                <div className="space-y-4">
                    <p className="text-gray-600"><strong>Name:</strong> {seller.name}</p>
                    <p className="text-gray-600"><strong>Store Name:</strong> {seller.storename}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {seller.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {seller.phone}</p>
                    <p className="text-gray-600 mt-10 font-semibold text-lg">Accout Details</p>
                    <p className="text-gray-600  ">Account no: <span className="text-black font-semibold">{seller.accountno}</span></p>
                    <p className="text-gray-600 ">IFSC code: <span className="text-black font-semibold">{seller.ifsc}</span></p>
                    Status: <span className={`text-md font-medium ${statusColor[seller.Status] || 'text-gray-500'}`}>
                        {seller.Status}
                    </span>
                </div>
                ) : (
                    <p>Loading seller details...</p> // ✅ Prevents error when seller is null
                )}
            </LeftSidebar>

            {/* Right Content Area */}
            <div className="ml-0 sm:ml-[25%] flex-1 p-6 bg-gray-100">
                {seller ? (<h1 className="text-2xl font-bold">Welcome, {seller.name}</h1>)
                : <h1 className="text-2xl font-bold">Welcome, </h1>
                }

                {/* Stock Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <ShoppingBag size={20} /> Your Stock ({stock.length})
            </h2>

            {stock.length > 0 ? (
                <ul className="space-y-4">
                    {stock.map((product, index) => {
                        return (
                            <li key={index} className="border rounded-lg p-4 shadow-sm">
                                <details className="group">
                                    <summary className="flex justify-between items-center cursor-pointer">
                                        <div>
                                            <h3 className="text-lg font-semibold">{product.Name}</h3>
                                            <p className="text-sm text-gray-500">{product.Category} • {product.Subcategory}</p>
                                            <p className="text-sm mt-1">Stock: <span className="font-medium">{product.CurrentStock}</span> pcs</p>
                                        </div>
                                        <span className="text-blue-500 group-open:rotate-90 transition-transform">&#9654;</span>
                                    </summary>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Image */}
                                        <div className="w-full max-h-48 object-contain rounded border">
                                            {getFirstImage(product.images) ? (
                                            <img
                                                src={getFirstImage(product.images)}
                                                alt={product.Name}
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Price:</span> ₹{product.Price}</p>
                                            <p><span className="font-medium">Discount:</span> {product.Discount}%</p>
                                            <p><span className="font-medium">Status:</span> {product.Status}</p>
                                            <p><span className="font-medium">Product Status:</span> {product.ProductStatus}</p>
                                            <p className="line-clamp-3 text-gray-600">{product.Description}</p>

                                            <div className="flex justfy-between">
                                                <button
                                                    className="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                                                    onClick={() => navigate(`/visit/${product.SellerInventoryID}?type=seller`)}
                                                >
                                                    <Eye size={14} className="mr-1" /> View
                                                </button>
                                                {product.Status === "Pending" && <button
                                                    className="mt-2 ml-6 inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                                                    onClick={() => handleRemoveInventory(product.SellerInventoryID, product.Name)}
                                                >
                                                    Remove
                                                </button>}
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">No products in stock</p>
            )}
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