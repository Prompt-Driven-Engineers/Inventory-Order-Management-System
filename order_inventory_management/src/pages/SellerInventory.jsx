import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SellerInventory() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetchSellerInventory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/admins/sellerInventory', {
                    withCredentials: true,
                });
                setInventory(res.data);
            } catch (err) {
                console.error("Error fetching seller inventory:", err);
            }
        };

        fetchSellerInventory();
    }, []);

    const handleStatusChange = async (inventoryId, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/admins/updateStatus/${inventoryId}`, { status: newStatus }, {
                withCredentials: true
            });
            setInventory(prev =>
                prev.map(item =>
                    item.SellerInventoryID === inventoryId
                        ? { ...item, Status: newStatus }
                        : item
                )
            );
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const statusColor = {
        Approved: 'text-green-600',
        Pending: 'text-yellow-500',
        Rejected: 'text-red-600'
    };

    return (
        <div className="p-4 space-y-4">
            {inventory.length > 0 ? (
                inventory.map(item => (
                    <details
                        key={item.SellerInventoryID}
                        className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden"
                    >
                        <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Product Image */}
                                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden">
                                    {(() => {
                                        try {
                                            const imgs = JSON.parse(item.images?.[0] || "[]");
                                            return imgs.length ? (
                                                <img
                                                    src={imgs[0]}
                                                    alt={item.Name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                            );
                                        } catch {
                                            return <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>;
                                        }
                                    })()}
                                </div>

                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{item.Name}</h3>
                                    <p className="text-sm text-gray-500">Store: {item.StoreName}</p>
                                </div>
                            </div>

                            <span className={`text-sm font-medium ${statusColor[item.Status] || 'text-gray-500'}`}>
                                {item.Status}
                            </span>
                        </summary>

                        {/* Expanded Content */}
                        <div className="p-4 border-t bg-gray-50 text-sm space-y-1">
                            <p><strong>Description:</strong> {item.Description}</p>
                            <p><strong>Price:</strong> ₹{Number(item.Price).toFixed(2)}</p>
                            <p><strong>Discount:</strong> {item.Discount}%</p>
                            <p><strong>Quantity:</strong> {item.Quantity}</p>
                            <p><strong>Current Stock:</strong> {item.CurrentStock}</p>
                            <p><strong>Platform Commission:</strong> ₹{item.PlatformCommission}</p>
                            <p><strong>Added At:</strong> {new Date(item.AddedAt).toLocaleString()}</p>

                            <div className="pt-2">
                                <label htmlFor="status" className="mr-2 font-medium">Change Status:</label>
                                <select
                                    id="status"
                                    className="border px-2 py-1 rounded"
                                    value={item.Status}
                                    onChange={e => handleStatusChange(item.SellerInventoryID, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </details>
                ))
            ) : (
                <p className="text-gray-500">Loading Inventory...</p>
            )}
        </div>
    );
}
