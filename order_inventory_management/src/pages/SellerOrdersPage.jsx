import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const orderStatusOptions = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
    ];

    const statusFlow = {
        Pending: ["Pending", "Processing", "Cancelled"],
        Processing: ["Processing", "Shipped", "Cancelled"],
        Shipped: ["Shipped", "Delivered", "Returned"],
        Delivered: ["Delivered", "Returned"],
        Cancelled: ["Cancelled"],
        Returned: ["Returned"],
    };


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:8000/sellers/orders", {
                    withCredentials: true,
                });

                const sorted = res.data.sort(
                    (a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)
                );

                setOrders(sorted);
                console.log(sorted);
            } catch (err) {
                setError("Something went wrong.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        // TODO: Connect this to your backend to update order status
        console.log(`Order ${orderId} status changed to ${newStatus}`);
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="p-4 space-y-4">
            {orders.map((order, index) => (
                <details
                    key={index}
                    className="bg-white shadow-md rounded-xl border"
                    open={false}
                >
                    <summary className="flex flex-col sm:flex-row sm:justify-between sm:items-center cursor-pointer p-4 gap-2">
                        <div className="text-gray-800 font-semibold">
                            Order #{order.OrderID} — {new Date(order.OrderDate).toLocaleDateString()}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                            <select
                                value={order.OrderStatus}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(order.OrderID, e.target.value);
                                }}
                                className="border px-2 py-1 rounded text-sm bg-white"
                            >
                                {orderStatusOptions.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        disabled={!statusFlow[order.OrderStatus].includes(status)}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>


                            <button
                                onClick={() => {
                                    navigate(`/visit/${order.ProductID}?type=product`);
                                }}
                                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                            >
                                View
                            </button>
                        </div>
                    </summary>

                    <div className="p-4 text-sm text-gray-700 space-y-1">
                        <p>
                            <strong>Product ID:</strong> {order.ProductID}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {order.Quantity}
                        </p>
                        <p>
                            <strong>Price:</strong> ₹{order.Price}
                        </p>
                        <p>
                            <strong>Total:</strong> ₹{order.TotalAmount}
                        </p>
                        <p>
                            <strong>Payment:</strong> {order.PaymentMethod} –{" "}
                            {order.PaymentStatus}
                        </p>
                        <p>
                            <strong>Shipping Address ID:</strong> {order.ShippingAddressID}
                        </p>
                    </div>
                </details>
            ))}
        </div>
    );
};

export default SellerOrders;
