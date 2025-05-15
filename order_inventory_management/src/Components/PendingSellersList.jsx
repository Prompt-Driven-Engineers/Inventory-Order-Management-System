import { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';

export default function PendingSellersList() {
    const [sellers, setSellers] = useState([]);
    const [refresh, setRefresh] = useState(false); // Track refresh state

    useEffect(() => {
        axios.get(`http://localhost:8000/sellers//pendingSellers`, {
            withCredentials: true
        })
            .then((res) => {
                setSellers(res.data.sellers); // Correctly accessing response data
                console.log(res.data.sellers); // Log actual data
            })
            .catch((err) => {
                console.error("Error fetching seller:", err);
                setSellers([]); // Set empty array instead of null (better for rendering)
            });
    }, [refresh]);

    const handleStatusChange = (SellerID, newStatus) => {
        console.log(SellerID, newStatus);
        axios.put(
            "http://localhost:8000/sellers/modSellerStatus",
            { SellerID, newStatus },  // Send SellerID & new status
            { withCredentials: true }  // placement of withCredentials
        )
        .then((res) => {
            if (res.status === 200) {
                toast.success("Status Change Successful");
                setRefresh((prev) => !prev); // Toggle `refresh` to trigger useEffect
            }
        })
        .catch((err) => {
            toast.error("Error updating status");
            console.error("Error updating status:", err);
        });
    };

    return (
        <>
            <div className="p-6 space-y-10">
                {/* Section: Pending Sellers */}
                <section>
                    <h2 className="text-2xl font-semibold text-yellow-700 mb-4">Pending Sellers</h2>
                    {sellers.length > 0 ? (
                        <div className="space-y-4">
                            {sellers.filter(s => s.Status === 'Pending').map((seller) => (
                                <div
                                    key={seller.UserID}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow border"
                                >
                                    {/* Seller Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                                        <div>
                                            <p className="font-semibold">{seller.Name}</p>
                                            <p className="text-gray-600">{seller.Email}</p>
                                            <p className="text-gray-600">📞 {seller.Phone}</p>
                                        </div>
                                        <div>
                                            <p className="italic text-gray-700">🏪 {seller.StoreName || "No Store Name"}</p>
                                            <p>🧾 PAN: {seller.PAN}</p>
                                            <p>⭐ Rating: {seller.StoreRating}</p>
                                        </div>
                                        <div>
                                            <p>📦 Orders: {seller.TotalOrdersFullfilled}</p>
                                            <p>💰 Sales: ₹{seller.TotalSales}</p>
                                            <p>📅 Joined: {new Date(seller.CreatedAt).toLocaleDateString()}</p>
                                            {seller.LastLogin && <p>🕒 Last Login: {new Date(seller.LastLogin).toLocaleString()}</p>}
                                        </div>
                                    </div>

                                    {/* Status Selector */}
                                    <select
                                        onChange={(e) => {
                                            if (seller.Status !== e.target.value) handleStatusChange(seller.SellerID, e.target.value);
                                        }}
                                        defaultValue={seller.Status}
                                        className="mt-4 sm:mt-0 border p-2 rounded text-sm bg-gray-50"
                                    >
                                        <option value="Active">Activate</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Suspended">Suspend</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Loading seller list...</p>
                    )}
                </section>

                {/* Section: Active Sellers */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-700 mb-4">Active Sellers</h2>
                    {sellers.length > 0 ? (
                        <div className="space-y-4">
                            {sellers.filter(s => s.Status === 'Active').map((seller) => (
                                <div
                                    key={seller.UserID}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow border"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                                        <div>
                                            <p className="font-semibold">{seller.Name}</p>
                                            <p className="text-gray-600">📧 {seller.Email}</p>
                                            <p className="text-gray-600">📞 {seller.Phone}</p>
                                        </div>
                                        <div>
                                            <p className="italic text-gray-700">🏪 {seller.StoreName || "No Store Name"}</p>
                                            <p>🧾 PAN: {seller.PAN}</p>
                                            <p>⭐ Rating: {seller.StoreRating}</p>
                                        </div>
                                        <div>
                                            <p>📦 Orders: {seller.TotalOrdersFullfilled}</p>
                                            <p>💰 Sales: ₹{seller.TotalSales}</p>
                                            <p>🗓 Joined: {new Date(seller.CreatedAt).toLocaleDateString()}</p>
                                            {seller.LastLogin && (
                                                <p>🕒 Last Login: {new Date(seller.LastLogin).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Selector */}
                                    <select
                                        onChange={(e) => {
                                            if (seller.Status !== e.target.value)
                                                handleStatusChange(seller.SellerID, e.target.value);
                                        }}
                                        defaultValue={seller.Status}
                                        className="mt-4 sm:mt-0 border p-2 rounded text-sm bg-gray-50"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Loading seller list...</p>
                    )}
                </section>
                {/* Section: Suspended Sellers */}
                <section>
                    <h2 className="text-2xl font-semibold text-red-700 mb-4">Suspended Sellers</h2>
                    {sellers.length > 0 ? (
                        <div className="space-y-4">
                            {sellers.filter(s => s.Status === 'Suspended').map((seller) => (
                                <div
                                    key={seller.UserID}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow border"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                                        <div>
                                            <p className="font-semibold">{seller.Name}</p>
                                            <p className="text-gray-600">📧 {seller.Email}</p>
                                            <p className="text-gray-600">📞 {seller.Phone}</p>
                                        </div>
                                        <div>
                                            <p className="italic text-gray-700">🏪 {seller.StoreName || "No Store Name"}</p>
                                            <p>🧾 PAN: {seller.PAN}</p>
                                            <p>⭐ Rating: {seller.StoreRating}</p>
                                        </div>
                                        <div>
                                            <p>📦 Orders: {seller.TotalOrdersFullfilled}</p>
                                            <p>💰 Sales: ₹{seller.TotalSales}</p>
                                            <p>🗓 Joined: {new Date(seller.CreatedAt).toLocaleDateString()}</p>
                                            {seller.LastLogin && (
                                                <p>🕒 Last Login: {new Date(seller.LastLogin).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Selector */}
                                    <select
                                        onChange={(e) => {
                                            if (seller.Status !== e.target.value)
                                                handleStatusChange(seller.SellerID, e.target.value);
                                        }}
                                        defaultValue={seller.Status}
                                        className="mt-4 sm:mt-0 border p-2 rounded text-sm bg-gray-50"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Loading seller list...</p>
                    )}
                </section>
            </div>
        </>
    );
}
