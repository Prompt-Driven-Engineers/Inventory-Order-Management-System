import { useState, useEffect } from "react";
import { ShoppingBag, PlusCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SellerDashboard() {
    const [seller, setSeller] = useState(null);
    const [stock, setStock] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const { UserID } = useParams();
    console.log("Extracted UserID from URL:", UserID);

    useEffect(() => {
        console.log(UserID);
        axios.get(`http://localhost:8000/sellers/${UserID}`)
            .then((res) => {
                setSeller(res.data); // ✅ Store only the response data
                console.log(res.data); // ✅ Log actual data
            })
            .catch((err) => {
                console.error("Error fetching seller:", err);
                setSeller(null); // Ensure state is handled on error
            });
    }, [UserID]);

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-gray-200 p-6 flex flex-col items-start">
                {seller ? (
                    <>
                        <p className="text-gray-700 font-semibold text-lg">{seller.storename}</p>
                        <p className="text-gray-600">{seller.email}</p>
                        <p className="text-gray-600">{seller.phone}</p>
                    </>
                ) : (
                    <p>Loading seller details...</p> // ✅ Prevents error when seller is null
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
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <PlusCircle size={20} /> Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};