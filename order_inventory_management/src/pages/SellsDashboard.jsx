import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SellsDashboard() {
    const [sellsData, setSellsData] = useState();
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchSellsData() {
            try {
                const res = await axios.get('http://localhost:8000/admins//sellsDash', {
                    withCredentials: true,
                });
                setSellsData(res.data);
            } catch (err) {
                console.error("Error fetching selles data:", err);
            }
        }
        fetchSellsData();
    }, []);

    return (
        <div className="p-4 space-y-4">
            {sellsData && sellsData.map((sell) => {
                const imageUrl = JSON.parse(sell.images?.[0] || '[]')[0];

                return (
                    <div
                        key={sell.ProductID}
                        className="flex items-center gap-4 bg-white rounded-xl shadow p-4"
                    >
                        <img
                            src={imageUrl}
                            alt={sell.Name}
                            className="w-28 h-28 object-cover rounded-md border"
                        />

                        <div className="flex-1">
                            <h2 className="text-lg font-semibold">{sell.Name}</h2>
                            <p className="text-gray-600">Avg Price: ₹{parseFloat(sell.AvgPrice).toFixed(2)}</p>
                            <p className="text-sm font-semibold text-green-700">
                                Total Quantity Sold: {sell.TotalQuantity}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(`/visit/${sell.ProductID}?type=product`)}
                            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            View
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
