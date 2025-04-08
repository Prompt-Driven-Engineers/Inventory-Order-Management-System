import React, { useEffect, useState } from 'react';
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
            <h1>Seller Details</h1>
            {sellers.length > 0 ? ( // Ensures data is actually present
                <div>
                    {sellers.map((seller) => (
                        seller.Status == 'Active' && <div key={seller.UserID}
                        className='flex  justify-around'
                        >
                            <p>{seller.Name}</p>
                            <p>{seller.Email}</p>
                            <p>{seller.Role}</p>
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
                            <p>{seller.Role}</p>
                        </div> // Fixed return issue
                    ))}
                </div>
            ) : (
                <p>seller list loading...</p>
            )}
        </>
    );    
}
