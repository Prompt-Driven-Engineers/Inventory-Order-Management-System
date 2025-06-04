import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ReOrderList() {
    const [alerts, setAlerts] = useState();
    useEffect(() => {
        async function fetchReorderList() {
            await axios.get('http://localhost:8000/admins/reorderList', { withCredentials: true })
            .then((res) => {
                setAlerts(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error fetching ReOrder List:", err);
            });
        }
        fetchReorderList();
    }, []);

    return (
  <div className="p-4">
    <h2 className="text-2xl font-semibold mb-4 text-red-600">Reorder Alert List</h2>

    {alerts && alerts.length > 0 ? (
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.ProductID}
            className="flex items-center gap-4 border border-red-300 rounded-lg p-3 bg-red-50 shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Left: Image */}
            <div className="flex-shrink-0 w-24 h-24">
              {alert.images && alert.images.length > 0 ? (
                <img
                  src={JSON.parse(alert.images[0])[0]}
                  alt={alert.Name}
                  className="w-full h-full object-contain rounded border"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col text-sm text-gray-700">
              <span className="font-semibold text-lg text-gray-900">{alert.Name}</span>
              <span><strong>Brand:</strong> {alert.Brand}</span>
              <span><strong>Category:</strong> {alert.Category}</span>
              <span><strong>Subcategory:</strong> {alert.Subcategory}</span>
              <span className="text-red-700"><strong>Current Stock:</strong> {alert.TotalStock}</span>
              <span><strong>Total Quantity Needed:</strong> 100</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No low-stock products to reorder.</p>
    )}
  </div>
);

}
