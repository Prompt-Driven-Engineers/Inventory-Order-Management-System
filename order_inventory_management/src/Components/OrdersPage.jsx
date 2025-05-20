import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8000/admins/allOrders', {
                    withCredentials: true
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <details
                            key={order.OrderID}
                            className="border rounded-xl p-4 shadow-md bg-white"
                        >
                            <summary className="cursor-pointer font-medium flex justify-between items-center">
                                <div>
                                    <p><span className="font-semibold">Order ID:</span> {order.OrderID}</p>
                                    <p><span className="font-semibold">Date:</span> {new Date(order.OrderDate).toLocaleDateString()}</p>
                                    <p><span className="font-semibold">Status:</span> {order.OrderStatus}</p>
                                </div>
                            </summary>

                            <div className="mt-4">
                                <p><strong>Total Amount:</strong> ₹{order.TotalAmount}</p>
                                <p><strong>Payment Method:</strong> {order.PaymentMethod}</p>
                                <p><strong>Payment Status:</strong> {order.PaymentStatus}</p>

                                <div className="mt-3">
                                    <h4 className="font-semibold">Items:</h4>
                                    <ul className="list-disc list-inside space-y-2 mt-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className='flex justify-between items-center'>
                                                <li className="ml-2">
                                                    <p><strong>Product:</strong> {item.Product?.Name || 'N/A'}</p>
                                                    <p><strong>Quantity:</strong> {item.Quantity}</p>
                                                    <p><strong>Price:</strong> ₹{item.Price}</p>
                                                </li>
                                                <button
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    onClick={() => {
                                                        const id = item.SellerInventoryID;
                                                        const type = "seller";
                                                        navigate(`/visit/${id}?type=${type}`);
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
}
