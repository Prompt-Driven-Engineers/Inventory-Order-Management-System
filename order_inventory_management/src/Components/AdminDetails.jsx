import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function AdminDetails() {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/admins/adminList`, {
            withCredentials: true
        })
        .then((res) => {
            setAdmins(res.data.admins); // Correctly accessing response data
            console.log(res.data.admins); // Log actual data
        })
        .catch((err) => {
            console.error("Error fetching admin:", err);
            setAdmins([]); // Set empty array instead of null (better for rendering)
        });
    }, []);    

    return (
        <>
            <h1>Admin Details</h1>
            {admins.length > 0 ? ( // Ensures data is actually present
                <div>
                    {admins.map((admin) => (
                        <div key={admin.UserID}
                        className='flex  justify-around'
                        >
                            <p>{admin.Name}</p>
                            <p>{admin.Email}</p>
                            <p>{admin.Role}</p>
                        </div> // Fixed return issue
                    ))}
                </div>
            ) : (
                <p>Admin list loading...</p>
            )}
        </>
    );    
}
