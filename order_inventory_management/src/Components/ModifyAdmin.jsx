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
        <>
            <h1>Manage Admins</h1>
            {admins.map((admin) => (
                <div key={admin.AdminID} className='flex justify-around p-2 border-b'>
                    {/* Admin ID */}
                    <p>{admin.AdminID}</p>

                    {/* Admin Name */}
                    <p>{admin.Name}</p>

                    {/* Role Dropdown (Excluding SuperAdmin) */}
                    <select 
                        onChange={(e) => {
                            if(admin.Role !== e.target.value) handleRoleChange(admin.AdminID, e.target.value);
                        }}
                        value={admin.Role}
                        className="border p-2 rounded"
                    >
                        <option disabled>Change Role</option>
                        {Roles.filter(role => role.RoleName !== 'SuperAdmin').map((role, index) => (
                            <option key={index} value={role.RoleName}>{role.RoleName}</option>
                        ))}
                    </select>

                    {/* Account Status Dropdown */}
                    <select 
                        onChange={(e) => {
                            if(admin.Role !== e.target.value) handleStatusChange(admin.AdminID, e.target.value);
                        }}
                        defaultValue={admin.AccountStatus}
                        className="border p-2 rounded"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            ))}
        </>
    );
}
