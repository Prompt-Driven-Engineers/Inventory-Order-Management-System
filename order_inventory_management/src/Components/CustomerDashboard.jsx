import { useState, useEffect, useContext } from "react";
import { ShoppingBag, PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        // console.log(UserID);
        axios.get(`http://localhost:8000/customers/customerDetails`, {
            withCredentials: true
        })
            .then((res) => {
                setCustomer(res.data); // ✅ Store only the response data
                console.log(res.data); // ✅ Log actual data
            })
            .catch((err) => {
                console.error("Error fetching customer:", err);
                setCustomer(null); // Ensure state is handled on error
            });
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-1/5 bg-gray-200 p-6 flex flex-col items-start">
                {customer ? (
                    <>
                        <p className="text-gray-600">{customer.email}</p>
                        <p className="text-gray-600">{customer.phone}</p>
                        <p className="text-gray-600">{customer.address.Landmark}</p>
                        
                    </>
                ) : (
                    <p>Loading customer details...</p> // ✅ Prevents error when customer is null
                )}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 bg-gray-100">
                {customer ? (<h1 className="text-2xl font-bold">Welcome, {customer.name}</h1>)
                : <h1 className="text-2xl font-bold">Welcome, </h1>
                }

            </div>
        </div>
    );
};