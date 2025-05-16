import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Roles } from '../Data/Roles'; // Import the roles array

export default function ModifyAdmin() {
    const [admins, setAdmins] = useState([]);
    const [refresh, setRefresh] = useState(false); // Track refresh state

    useEffect(() => {
        axios.get(`http://localhost:8000/admins/adminListMod`, {
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
    }, [refresh]);

    const handleRoleChange = (AdminID, newRole) => {
        axios.put(
            "http://localhost:8000/admins/modRole",
            { AdminID, newRole },  // Send AdminID & new Role
            { withCredentials: true }  // placement of withCredentials
        )
            .then((res) => {
                if (res.status === 200) {
                    console.log("Role Change Successful");
                    setRefresh((prev) => !prev); // Toggle `refresh` to trigger useEffect
                }
            })
            .catch((err) => {
                console.error("Error updating role:", err);
            });
    };

    const handleStatusChange = (AdminID, newAccountStatus) => {
        axios.put(
            "http://localhost:8000/admins/modStatus",
            { AdminID, newAccountStatus },  // Send AdminID & new status
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
        <div className='p-4'>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Admins</h1>

            {admins.map((admin) => (
                <div
                    key={admin.AdminID}
                    className="bg-white shadow-sm rounded-lg p-4 mb-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    {/* Admin Info */}
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-700">Admin ID: <span className="text-gray-900">{admin.AdminID}</span></p>
                        <p className="font-semibold text-gray-700">Name: <span className="text-gray-900">{admin.Name}</span></p>
                    </div>

                    {/* Role Dropdown */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Role</label>
                        <select
                            onChange={(e) => {
                                if (admin.Role !== e.target.value)
                                    handleRoleChange(admin.AdminID, e.target.value);
                            }}
                            value={admin.Role}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                        >
                            <option disabled>Change Role</option>
                            {Roles.filter(role => role.RoleName !== 'SuperAdmin').map((role, index) => (
                                <option key={index} value={role.RoleName}>{role.RoleName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Account Status Dropdown */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Account Status</label>
                        <select
                            onChange={(e) => {
                                if (admin.AccountStatus !== e.target.value)
                                    handleStatusChange(admin.AdminID, e.target.value);
                            }}
                            defaultValue={admin.AccountStatus}
                            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
}
