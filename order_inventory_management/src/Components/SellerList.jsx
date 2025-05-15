import { useEffect, useState } from 'react';
import axios from "axios";

export default function SellerList() {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/sellers/sellerList`, {
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
    }, []);

    return (
        <>
            <div className="p-6 space-y-12">

                {/* Section Title */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Seller Details</h1>

                {/* PENDING SELLERS */}
                <section>
                    <h2 className="text-2xl font-semibold text-yellow-600 mb-4 border-b pb-2">🕓 Pending Sellers</h2>
                    {sellers.length > 0 ? (
                        <div className="grid gap-4">
                            {sellers.filter(s => s.Status === 'Pending').map(seller => (
                                <div key={seller.UserID} className="bg-white rounded-lg shadow-md p-4 border">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p><span className="font-semibold">Name:</span> {seller.Name}</p>
                                            <p><span className="font-semibold">Email:</span> {seller.Email}</p>
                                            <p><span className="font-semibold">Phone:</span> {seller.Phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-semibold">Store:</span> {seller.StoreName || 'N/A'}</p>
                                            <p><span className="font-semibold">Rating:</span> {seller.StoreRating}</p>
                                            <p><span className="font-semibold">Total Orders:</span> {seller.TotalOrdersFullfilled}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-semibold">PAN:</span> {seller.PAN}</p>
                                            <p><span className="font-semibold">IFSC:</span> {seller.IFSC}</p>
                                            <p><span className="font-semibold">Account No:</span> {seller.AccountNo}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">Loading pending sellers...</p>}
                </section>

                {/* ACTIVE SELLERS */}
                <section>
                    <h2 className="text-2xl font-semibold text-green-600 mb-4 border-b pb-2">✅ Active Sellers</h2>
                    <div className="space-y-2">
                        {sellers.filter(s => s.Status === 'Active').map((seller) => (
                            <details key={seller.UserID} className="border rounded-lg shadow bg-white">
                                <summary className="flex justify-between items-center p-4 cursor-pointer">
                                    <div>
                                        <p className="font-semibold">{seller.Name}</p>
                                        <p className="text-sm text-gray-600">{seller.Email}</p>
                                        <p className="text-sm text-gray-500 italic">{seller.StoreName}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${seller.Status === 'Active' ? 'bg-green-100 text-green-700' : seller.Status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {seller.Status}
                                    </span>
                                </summary>

                                <div className="p-4 border-t text-sm grid md:grid-cols-2 gap-4 bg-gray-50">
                                    <div>
                                        <p><strong>Phone:</strong> {seller.Phone}</p>
                                        <p><strong>Store Rating:</strong> {seller.StoreRating}</p>
                                        <p><strong>Orders Fulfilled:</strong> {seller.TotalOrdersFullfilled}</p>
                                        <p><strong>Total Sales:</strong> ₹{seller.TotalSales}</p>
                                    </div>
                                    <div>
                                        <p><strong>PAN:</strong> {seller.PAN}</p>
                                        <p><strong>IFSC:</strong> {seller.IFSC}</p>
                                        <p><strong>Account No:</strong> {seller.AccountNo}</p>
                                        <p><strong>Store Details:</strong> {seller.StoreDetails || 'Not provided'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p><strong>Created At:</strong> {new Date(seller.CreatedAt).toLocaleString()}</p>
                                        <p><strong>Last Login:</strong> {seller.LastLogin ? new Date(seller.LastLogin).toLocaleString() : 'Never'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold">Address:</p>
                                        {seller.Addresses && seller.Addresses.length > 0 ? (
                                            seller.Addresses.map((addr, index) => (
                                                <p key={index}>
                                                    {addr.AddressType}: {addr.Street}, {addr.City}, {addr.State}, {addr.Zip}, {addr.Country} (Landmark: {addr.Landmark})
                                                </p>
                                            ))
                                        ) : (
                                            <p>No address found</p>
                                        )}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* SUSPENDED SELLERS */}
                <section>
                    <h2 className="text-2xl font-semibold text-red-600 mb-4 border-b pb-2">🚫 Suspended Sellers</h2>
                    <div className="space-y-2">
                        {sellers.filter(s => s.Status === 'Suspended').map((seller) => (
                            <details key={seller.UserID} className="border rounded-lg shadow bg-white">
                                <summary className="flex justify-between items-center p-4 cursor-pointer">
                                    <div>
                                        <p className="font-semibold">{seller.Name}</p>
                                        <p className="text-sm text-gray-600">{seller.Email}</p>
                                        <p className="text-sm text-gray-500 italic">{seller.StoreName}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${seller.Status === 'Active' ? 'bg-green-100 text-green-700' : seller.Status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {seller.Status}
                                    </span>
                                </summary>

                                <div className="p-4 border-t text-sm grid md:grid-cols-2 gap-4 bg-gray-50">
                                    <div>
                                        <p><strong>Phone:</strong> {seller.Phone}</p>
                                        <p><strong>Store Rating:</strong> {seller.StoreRating}</p>
                                        <p><strong>Orders Fulfilled:</strong> {seller.TotalOrdersFullfilled}</p>
                                        <p><strong>Total Sales:</strong> ₹{seller.TotalSales}</p>
                                    </div>
                                    <div>
                                        <p><strong>PAN:</strong> {seller.PAN}</p>
                                        <p><strong>IFSC:</strong> {seller.IFSC}</p>
                                        <p><strong>Account No:</strong> {seller.AccountNo}</p>
                                        <p><strong>Store Details:</strong> {seller.StoreDetails || 'Not provided'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p><strong>Created At:</strong> {new Date(seller.CreatedAt).toLocaleString()}</p>
                                        <p><strong>Last Login:</strong> {seller.LastLogin ? new Date(seller.LastLogin).toLocaleString() : 'Never'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold">Address:</p>
                                        {seller.Addresses && seller.Addresses.length > 0 ? (
                                            seller.Addresses.map((addr, index) => (
                                                <p key={index}>
                                                    {addr.AddressType}: {addr.Street}, {addr.City}, {addr.State}, {addr.Zip}, {addr.Country} (Landmark: {addr.Landmark})
                                                </p>
                                            ))
                                        ) : (
                                            <p>No address found</p>
                                        )}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}