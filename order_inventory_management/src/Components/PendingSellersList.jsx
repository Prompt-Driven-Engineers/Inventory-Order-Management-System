import React, { useEffect, useState } from 'react';
import axios from "axios";

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
                console.log("Status Change Successful");
                setRefresh((prev) => !prev); // Toggle `refresh` to trigger useEffect
            }
        })
        .catch((err) => {
            console.error("Error updating status:", err);
        });
    };

    return (
        <>
            <h1>Pending Sellers</h1>
            {sellers.length > 0 ? ( // Ensures data is actually present
                <div>
                    {sellers.map((seller) => (
                        seller.Status == 'Pending' && <div key={seller.UserID}
                        className='flex  justify-around'
                        >
                            <p>{seller.Name}</p>
                            <p>{seller.Email}</p>
                            <p>{seller.StoreName}</p>
                            <select 
                                onChange={(e) => {
                                    if(seller.Status !== e.target.value) handleStatusChange(seller.SellerID, e.target.value);
                                }}
                                defaultValue={seller.Status}
                                className="border p-2 rounded"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div> // Fixed return issue
                    ))}
                </div>
            ) : (
                <p>seller list loading...</p>
            )}
            <h1>Active Sellers</h1>
            {sellers.length > 0 ? ( // Ensures data is actually present
                <div>
                    {sellers.map((seller) => (
                        seller.Status == 'Active' && <div key={seller.UserID}
                        className='flex  justify-around'
                        >
                            <p>{seller.Name}</p>
                            <p>{seller.Email}</p>
                            <p>{seller.StoreName}</p>
                            <select 
                                onChange={(e) => {
                                    if(seller.Status !== e.target.value) handleStatusChange(seller.SellerID, e.target.value);
                                }}
                                defaultValue={seller.Status}
                                className="border p-2 rounded"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div> // Fixed return issue
                    ))}
                </div>
            ) : (
                <p>seller list loading...</p>
            )}
            <h1>Suspended Sellers</h1>
            {sellers.length > 0 ? ( // Ensures data is actually present
                <div>
                    {sellers.map((seller) => (
                        seller.Status == 'Suspended' && <div key={seller.UserID}
                        className='flex  justify-around'
                        >
                            <p>{seller.Name}</p>
                            <p>{seller.Email}</p>
                            <p>{seller.StoreName}</p>
                            <select 
                                onChange={(e) => {
                                    if(seller.Status !== e.target.value) handleStatusChange(seller.SellerID, e.target.value);
                                }}
                                defaultValue={seller.Status}
                                className="border p-2 rounded"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div> // Fixed return issue
                    ))}
                </div>
            ) : (
                <p>seller list loading...</p>
            )}
        </>
    );
}
