import { useState, useEffect } from "react";
import { ShoppingBag, Heart, PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { formatOrderDate, getFirstImage } from "../functions/func";
import { toast } from "react-toastify";
import LeftSidebar from "./LeftSidebar";

export default function CustomerDashboard({ setIsLoggedIn, isLoggedIn, setUser }) {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [orderedProducts, setOrderedProducts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/customers/customerDetails`, {
            withCredentials: true
        })
            .then((res) => {
                setCustomer(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching customer:", err);
                setCustomer(null);
                setError("Failed to load customer details.");
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/customers/getOrderedProducts', {
            withCredentials: true
        })
        .then((res) => {
            setOrderedProducts(res.data || []);
        })
        .catch((err) => {
            console.error("Error fetching orders:", err);
            setOrderedProducts([]);
            setError("Failed to load order details.");
        });
    }, []);

    const deliveredOrders = orderedProducts.filter(order => order.OrderStatus === "Delivered");
    const pendingOrders = orderedProducts.filter(order => order.OrderStatus !== "Delivered");

    const handleCancelOrder = (orderId) => {
        if (!orderId) return;
      
        // Dismiss any existing confirmation toast if needed
        toast.dismiss();
      
        const toastId = toast(
          ({ closeToast }) => (
            <div className="space-y-2">
              <p className="text-sm text-gray-800">Are you sure you want to cancel this order?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    // Call cancel logic
                    confirmCancel(orderId);
                    toast.dismiss(toastId); // Close the toast
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(toastId); // Just close
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  No
                </button>
              </div>
            </div>
          ),
          {
            autoClose: false,
            position: "top-center",
          }
        );
      };
      
      const confirmCancel = (orderId) => {
        axios.put(`http://localhost:8000/customers/getOrderedProducts/${orderId}`, {}, { withCredentials: true})
        .then((res) => {
            toast.success("Order cancelled");
        })
        .catch((err) => {
            toast.error("Error in cancelling order");
        })
      };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Loading customer details...</p>
            </div>
        );
    }

    const address = customer.addresses?.[0];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <LeftSidebar setIsLoggedIn={setIsLoggedIn} setUser={setUser} navigate={navigate} isLoggedIn={isLoggedIn}>
                {customer ? (
                <div className="space-y-4">
                    <p className="text-gray-600"><strong>Name:</strong> {customer.name}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {customer.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {customer.phone}</p>
                    <p className="text-gray-600"><strong>Subscription:</strong> {customer.SubscriptionStatus}</p>
                    <p className="text-gray-600"><strong>Points:</strong> {customer.Points}</p>
                    <p className="text-gray-600"><strong>Total Orders:</strong> {customer.TotalOrders}</p>

                    {address && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Address</h3>
                            <p className="text-gray-600">{address.Street}, {address.City}</p>
                            <p className="text-gray-600">{address.State}, {address.Country}</p>
                            <p className="text-gray-600">{address.Zip}</p>
                            <p className="text-gray-600 italic">Landmark: {address.Landmark}</p>
                        </div>
                    )}
                </div>
                ) : (
                    <p>Loading seller details...</p> // ✅ Prevents error when seller is null
                )}
            </LeftSidebar>
            
            {/* Main Content */}
            <div className="ml-0 sm:ml-[25%] flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {customer.name}</h1>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div
                        onClick={() => navigate('/wishlist')}
                        className="cursor-pointer flex items-center justify-between p-4 bg-white shadow hover:shadow-md rounded-lg transition"
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Wishlist</h2>
                            <p className="text-sm text-gray-500">View your saved products</p>
                        </div>
                        <Heart className="text-pink-500 w-8 h-8" />
                    </div>

                    <div
                        onClick={() => navigate('/cart')}
                        className="cursor-pointer flex items-center justify-between p-4 bg-white shadow hover:shadow-md rounded-lg transition"
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
                            <p className="text-sm text-gray-500">Go to your shopping cart</p>
                        </div>
                        <ShoppingBag className="text-green-600 w-8 h-8" />
                    </div>

                    <div
                        onClick={() => navigate(`/find/${'electronics'}`)}
                        className="cursor-pointer flex items-center justify-between p-4 bg-white shadow hover:shadow-md rounded-lg transition"
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Shop</h2>
                            <p className="text-sm text-gray-500">Start shopping now</p>
                        </div>
                        <PlusCircle className="text-blue-600 w-8 h-8" />
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white p-6 rounded-lg shadow mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Orders</h2>

                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <div className="grid gap-6">
                        {/* Pending/Processing Orders */}
                        <div>
                            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Pending / Current</h3>
                            <ul className="space-y-4">
                                {pendingOrders.length > 0 ? (
                                    pendingOrders.map((order) => (
                                        <li key={order.OrderID} className="p-4 bg-gray-50 rounded shadow-sm space-y-2">
                                            <div className="flex justify-between items-start flex-wrap gap-2">
                                                <div>
                                                    <p className="text-gray-700 font-medium">Order #{order.OrderID}</p>
                                                    <p className="text-sm text-gray-500">Status: {order.OrderStatus}</p>
                                                    <p className="text-sm text-gray-500">Expected: {formatOrderDate(order.OrderDate)}</p>
                                                    <p className="text-sm text-gray-500">Total: ₹{order.TotalAmount}</p>
                                                    <p className="text-sm text-gray-500">Payment: {order.PaymentMethod}</p>
                                                </div>
                                                {(order.OrderStatus === "Pending" || order.OrderStatus === "Processing") 
                                                && <button
                                                    onClick={() => handleCancelOrder(order.OrderID)}
                                                    className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded hover:bg-red-200 transition"
                                                >
                                                    Cancel
                                                </button>}
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                {order.Products.map((product) => (
                                                    <div
                                                        key={product.OrderDetailID}
                                                        onClick={() => { navigate(`/visit/${product.SellerInventoryID}?type=seller`); }}
                                                        className="flex items-center gap-3 bg-white p-3 rounded shadow w-full sm:w-auto cursor-pointer"
                                                    >
                                                        {getFirstImage(product.images) ? (
                                                            <img
                                                                src={getFirstImage(product.images)}
                                                                alt={product.Name}
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-lg">
                                                                <span className="text-gray-500 text-sm">No Image</span>
                                                            </div>
                                                        )}
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-semibold text-gray-800">{product.Name}</p>
                                                            <p className="text-xs text-gray-500">{product.Brand}</p>
                                                            <p className="text-sm text-gray-700">₹{product.Price}</p>
                                                            <p className="text-sm text-gray-600">Qty: {product.Quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">No current orders.</p>
                                )}
                            </ul>

                        </div>

                        {/* Delivered Orders */}
                        <div>
                            <h3 className="text-xl font-semibold text-green-600 mb-2">Delivered</h3>
                            <ul className="space-y-4">
                                {deliveredOrders.length > 0 ? (
                                    deliveredOrders.map((order) => (
                                        <li key={order.OrderID} className="p-4 bg-gray-50 rounded shadow-sm space-y-2">
                                            <div>
                                                <p className="text-gray-700 font-medium">Order #{order.OrderID}</p>
                                                <p className="text-sm text-gray-500">Delivered on {order.OrderDate}</p>
                                                <p className="text-sm text-gray-500">Total: ₹{order.TotalAmount}</p>
                                                <p className="text-sm text-gray-500">Payment: {order.PaymentMethod}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {order.Products.map((product) => (
                                                    <div
                                                        key={product.OrderDetailID}
                                                        className="flex items-center gap-3 bg-white p-3 rounded shadow w-full sm:w-auto"
                                                    >
                                                        <img
                                                            src={product.images?.[0] || "/placeholder.jpg"}
                                                            alt={product.Name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-semibold text-gray-800">{product.Name}</p>
                                                            <p className="text-xs text-gray-500">{product.Brand}</p>
                                                            <p className="text-sm text-gray-700">₹{product.Price}</p>
                                                            <p className="text-sm text-gray-600">Qty: {product.Quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400">No delivered orders yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
