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
        <div className='p-4'>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Details</h1>

            {admins.length > 0 ? (
                <div className="space-y-4">
                    {admins.map((admin) => (
                        <div
                            key={admin.UserID}
                            className="bg-white shadow-md rounded-lg p-4 border grid md:grid-cols-3 gap-4"
                        >
                            <div>
                                <p><span className="font-semibold">Name:</span> {admin.Name}</p>
                                <p><span className="font-semibold">Email:</span> {admin.Email}</p>
                                <p><span className="font-semibold">Phone:</span> {admin.Phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Role:</span> {admin.Role}</p>
                                <p><span className="font-semibold">Admin ID:</span> {admin.AdminID}</p>
                                <p><span className="font-semibold">Account Status:</span> {admin.AccountStatus}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Aadhar:</span> {admin.AdharID}</p>
                                <p><span className="font-semibold">PAN:</span> {admin.PANID}</p>
                                <p><span className="font-semibold">Created At:</span> {new Date(admin.CreatedAt).toLocaleString()}</p>
                                <p><span className="font-semibold">Last Login:</span> {admin.LastLogin ? new Date(admin.LastLogin).toLocaleString() : 'Never'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Admin list loading...</p>
            )}
        </div>
    );
}
