import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showConfirmToast } from './ShowConfirmToast';

export default function AllProductsList() {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 50;
    const navigate = useNavigate();

    const fetchProducts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8000/products/allProducts?limit=${limit}&offset=${offset}`,
                { withCredentials: true }
            );

            const newProducts = res.data.products;
            // console.log(res.data.products);
            setProducts((prev) => [...prev, ...newProducts]);
            setOffset((prev) => prev + limit);

            // If we got less than limit, it means no more data
            if (newProducts.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts(); // initial load
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollBottom = window.innerHeight + document.documentElement.scrollTop;
            const documentHeight = document.documentElement.offsetHeight;

            if (scrollBottom >= documentHeight - 100) {
                fetchProducts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset, hasMore, loading]);

    const handleStatusChange = async (productId, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/products/${productId}/status`, {
                status: newStatus,
            });
            console.log("api called")
        } catch (err) {
            console.error("Error during status update:", err);
        }
    };

    const handleRemoveProduct = async (productId, productName) => {
        showConfirmToast({
            message: `Are you sure you want to delete the product "${productName}"?`,
            onConfirm: async () => {
                try {
                    await axios.delete(`http://localhost:8000/products/del/${productId}`);
                    toast.success("Product removed successfully");
                } catch (err) {
                    console.error("Error during remove product:", err);
                    toast.error("Failed to remove product");
                }
            },
            onCancel: () => {
                toast.info("Deletion cancelled");
            }
        });
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">All Products</h1>
            <div className="w-full">
                {products.length ? (
                    <ul className="w-full space-y-4">
                        {products.map((product, index) => (
                            <details
                                key={index}
                                className="bg-white border border-gray-300 rounded-lg shadow-sm transition hover:shadow-md"
                            >
                                <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-gray-100 rounded-lg">
                                    {/* Left: Image + Info */}
                                    <div className="flex items-center gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            {(() => {
                                                try {
                                                    const imgs = JSON.parse(product.images?.[0] || "[]");
                                                    return imgs.length ? (
                                                        <img
                                                            src={imgs[0]}
                                                            alt={product.Name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-sm">No Image</span>
                                                        </div>
                                                    );
                                                } catch {
                                                    return (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-sm">No Image</span>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>

                                        {/* Basic Info */}
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-800">{product.Name}</h3>
                                            <p className="text-gray-500 text-sm">Brand: {product.Brand}</p>
                                            <p className="text-gray-400 text-sm">Click to view more details</p>
                                        </div>
                                    </div>

                                    {/* Right: Status Badge */}
                                    <div>
                                        {(() => {
                                            const status = product.Status?.toLowerCase();
                                            let colorClass = "bg-gray-300 text-gray-800";

                                            if (status === "active") colorClass = "bg-green-100 text-green-700";
                                            else if (status === "inactive") colorClass = "bg-yellow-100 text-yellow-700";
                                            else if (status === "suspend") colorClass = "bg-red-100 text-red-700";

                                            return (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                                    {product.Status}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </summary>
                                {/* Expanded Details */}
                                <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">

                                    {/* Specs section */}
                                    {(() => {
                                        try {
                                            const rawSpec = product.Specifications?.spec || "";
                                            const cleanSpec = rawSpec.replace(/=>/g, ":");
                                            const parsed = JSON.parse(cleanSpec);
                                            const specs = parsed.product_specification;

                                            return Array.isArray(specs) ? (
                                                <div>
                                                    <strong className="block mb-1">Specifications:</strong>
                                                    <ul className="list-disc ml-6 space-y-1">
                                                        {specs.map((s, i) => (
                                                            <li key={i}>
                                                                <strong>{s.key || "Spec"}:</strong> {s.value}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : null;
                                        } catch (err) {
                                            // console.error("Spec parse error:", err);
                                            return null;
                                        }
                                    })()}

                                    {/* View Button */}
                                    <div className="pt-2 flex justify-between">
                                        <button
                                            onClick={() => {
                                                const id = product.ProductID;
                                                const type = "product";
                                                navigate(`/visit/${id}?type=${type}`);
                                            }}
                                            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                        >
                                            View
                                        </button>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <select
                                                defaultValue={product.Status}
                                                onClick={(e) => { handleStatusChange(product.ProductID, e.target.value) }}
                                                className="ml-1 border rounded px-2 py-1 text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="suspended">Suspend</option>
                                            </select>
                                        </p>
                                        <button
                                            onClick={() => { handleRemoveProduct(product.ProductID, product.Name)}}
                                            className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-lg text-gray-600">
                        No products found for your search.
                    </p>
                )}
            </div>
        </div>
    );
}
