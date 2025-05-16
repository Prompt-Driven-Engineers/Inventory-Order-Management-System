import React, { useEffect, useState } from 'react';
import { fetchAllCustomer } from '../apiCall/customer';
import axios from 'axios';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchAllCustomer();
      if (data) {
        setCustomers(data);
      }
      setLoading(false);
    };
    loadCustomers();
  }, []);

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/customers/${customerId}/status`, {
        status: newStatus,
      });
      console.log("api called")
    } catch (err) {
      console.error("Error during status update:", err);
    }
  };


  if (loading) return <p className="text-gray-500">Loading customers...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer List</h1>

      {customers.length > 0 ? (
        <div className="space-y-4">
          {customers.map((customer) => (
            <details
              key={customer.CustomerID}
              className="group border border-gray-300 rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-300"
            >
              <summary className="cursor-pointer px-6 py-4 flex justify-between items-center text-gray-800 font-semibold group-open:border-b group-open:bg-gray-50 group-open:rounded-b-none">
                <div>
                  {customer.user?.Name || 'Unnamed'}
                  <span className="text-gray-500 text-sm ml-2">(ID: {customer.CustomerID})</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-right text-sm">
                  <span className="text-blue-600">{customer.user?.Email || 'No email'}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${customer.Status === 'Active' ? 'bg-green-100 text-green-700' :
                      customer.Status === 'Ban' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}
              `}>
                    {customer.Status || 'Unknown'}
                  </span>
                </div>
              </summary>

              <div className="px-6 py-4 bg-gray-50 text-sm text-gray-700 space-y-4 rounded-b-lg">
                {/* User Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Phone:</span> {customer.user?.Phone || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {customer.user?.Email}</p>
                    <p><span className="font-medium">Created At:</span> {new Date(customer.user?.CreatedAt).toLocaleString()}</p>
                    <p><span className="font-medium">Last Login:</span> {customer.user?.LastLogin ? new Date(customer.user?.LastLogin).toLocaleString() : 'Never'}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Points:</span> {customer.Points}</p>
                    <p><span className="font-medium">Total Orders:</span> {customer.TotalOrders}</p>
                    <p><span className="font-medium">Total Spent:</span> ₹{customer.TotalSpent}</p>
                    <p><span className="font-medium">Subscription:</span> {customer.SubscriptionStatus}</p>
                  </div>
                </div>

                {/* Address Info */}
                <div>
                  <p className="font-semibold text-gray-800">Addresses:</p>
                  {customer.addresses.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      {customer.addresses.map((addr) => (
                        <li key={addr.AddressID}>
                          <span className="font-medium">{addr.AddressType}:</span> {addr.Street}, {addr.City}, {addr.State}, {addr.Zip}, {addr.Country}
                          {addr.Landmark && ` (Landmark: ${addr.Landmark})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No addresses found.</p>
                  )}
                </div>

                {/* Status Change */}
                <div>
                  <label className="font-medium mr-2">Change Status:</label>
                  <select
                    value={customer.Status}
                    onChange={(e) => handleStatusChange(customer.CustomerID, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                    <option value="Ban">Ban</option>
                  </select>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No customers found.</p>
      )}
    </div>

  );
}
