import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function ProductPage({ isLoggedIn, user }) {
    const { productId } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [product, setProduct] = useState(null); // Initialize with null to handle loading state
    const navigate = useNavigate();
    const [wishlisted, setWishlisted] = useState(false);
    const [carted, setCarted] = useState(false);

    // Fetch product by ID
    const fetchById = async () => {
        try {
            const response = await fetch(`http://localhost:8000/products/getById?id=${productId}&type=${type}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            setProduct(result);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const checkIfwishListed = async () => {
        const response = await fetch('http://localhost:8000/customers/isWishlist', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                productId,  // Could be producid or sellerinventoryid both
                type    // defines if the id is sellerinventoryid or productid
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // const result = await respose.json();
        const result = await response.json();
        if (response.ok) {
            setWishlisted(result.isWishlisted);
        } else {
            console.log('Error occured while finding in wishlist');
        }
    }

    const toggleWishlist = async () => {
        try {
            const response = await fetch('http://localhost:8000/customers/handleWishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId,
                    type,
                    isWishlisted: !wishlisted  // Corrected the spelling
                })
            });

            const data = await response.json();
            checkIfwishListed();
            if (response.ok) {
                console.log(`✅ ${data.message}`);
            } else {
                console.warn('⚠️ Failed to update wishlist:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('❌ Error updating wishlist:', error);
        }
    };

    const checkIfCarted = async () => {
        if (type === 'product') return;

        const response = await fetch('http://localhost:8000/customers/isCarted', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                SellerInventoryID: productId,  // Could be producid or sellerinventoryid both
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            setCarted(result.isCarted);
        } else {
            console.log('Error occured while finding in Cart');
        }
    }

    const toggleCart = async () => {
        if (type === 'product') return;

        try {
            const response = await fetch('http://localhost:8000/customers/handleCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    SellerInventoryID: productId,
                    isCarted: !carted  // Corrected the spelling
                })
            });

            const data = await response.json();
            checkIfCarted();
            if (response.ok) {
                console.log(`✅ ${data.message}`);
            } else {
                console.warn('⚠️ Failed to update Cart:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('❌ Error updating Cart:', error);
        }
    }

    // Call fetchById on component mount
    useEffect(() => {
        fetchById();  // Call the function correctly
    }, [productId]);  // Add productId as dependency to refetch if the ID changes

    useEffect(() => {
        if (isLoggedIn) {
            checkIfwishListed();
            checkIfCarted();
        }
    }, [isLoggedIn, productId]);

    // Handle loading and no-product state
    if (!product) return <div>Loading...</div>;
    if (!product.Name) return <div>No product found</div>;

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
                {/* Hero Banner */}
                {(product?.Discount > 10) && <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-4 rounded-lg shadow-lg mb-6">
                    <p className="text-xl font-bold">Exclusive Offer: Get {product.Discount || 0}% off on this product!</p>
                </div>}

                {/* Images */}
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {product.images ? (
                        (() => {
                            try {
                                const imagesArray = JSON.parse(product.images);  // Parse images
                                return imagesArray.length > 0 ? (
                                    imagesArray.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}  // Directly using image URL
                                            alt={`${product.Name} image ${index + 1}`}
                                            className="w-48 h-48 object-contain rounded-md m-2 shadow-md transform transition-transform duration-200 hover:scale-105"
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center w-full">No images available</div>
                                );
                            } catch (error) {
                                console.error("Invalid images format", error);
                                return (
                                    <div className="text-gray-500 text-center w-full">No images available</div>
                                );
                            }
                        })()
                    ) : (
                        <div className="text-gray-500 text-center w-full">No images available</div>
                    )}
                </div>

                {/* Product Name */}
                <div className="text-3xl font-semibold text-gray-800">{product.Name}</div>

                {/* Product Description */}
                <div className="text-lg text-gray-600 mt-2 mb-4">{product.Description}</div>

                {/* Dynamic Attributes */}
                {product.attributes && (
                    <div className="space-y-2 text-sm text-gray-700 mt-4">
                        {Object.keys(product.Specifications).map((key, index) => (
                            <div key={index}>
                                <strong>{key}:</strong> {product.attributes[key] || 'N/A'}
                            </div>
                        ))}
                    </div>
                )}

                {/* Price Box */}
                {product.Price && <div className="flex items-center justify-between mt-4">
                    <div className="text-3xl text-green-600 font-bold">₹{Math.round(product.Price - (product.Price * (product.Discount / 100)))}/-</div>
                    {product.Discount && (
                        <div className="text-xl text-red-500 font-medium line-through ml-4">
                            {/* ₹{Math.round(product.Price / (1 - product.Discount / 100))} */}
                            ₹{product.Price}
                        </div>
                    )}
                </div>}

                {/* Discount */}
                {product.Discount && (
                    <div className="text-lg text-red-500 font-medium mt-1">
                        Discount: {product.Discount}% off
                    </div>
                )}

                {/* Stock Availability */}
                <div className="text-sm text-gray-600 mt-2">
                    {product.CurrentStock > 0 ? `${product.CurrentStock} items in stock` : 'Out of stock'}
                </div>

                {/* Status */}
                {/* <div className="text-sm text-yellow-600 font-semibold mt-2">
                    Status: {product.Status === 'Pending' ? 'Pending Approval' : 'Available'}
                </div> */}

                {/* Wishlist and Cart Buttons */}

                {(user?.role !== 'Admin' && user?.role !== 'Seller') && <div className="space-x-4 mt-6 flex justify-between">
                    {/* Wishlist Button */}
                    {wishlisted ? (
                        <button
                            onClick={() => { isLoggedIn ? toggleWishlist() : navigate('/userLogin') }}
                            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center"
                        >
                            <i className="fas fa-heart mr-2"></i> Liked
                        </button>
                    ) : (
                        <button
                            onClick={() => { isLoggedIn ? toggleWishlist() : navigate('/userLogin') }}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center"
                        >
                            <i className="fas fa-heart mr-2"></i> Add to WishList
                        </button>
                    )}

                    {/* Cart Button */}
                    {product.SellerID && (
                        carted ? (
                            <button
                                onClick={() => { isLoggedIn ? navigate('/cart') : navigate('/userLogin') }}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center"
                            >
                                <i className="fas fa-shopping-cart mr-2"></i> Go to Cart
                            </button>
                        ) : (
                            <button
                                onClick={() => { isLoggedIn ? toggleCart() : navigate('/userLogin') }}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                            >
                                <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                            </button>
                        )
                    )}

                    {product.SellerID && <button
                        onClick={() => {
                            const selectedIds = [product.SellerInventoryID]
                            isLoggedIn ?
                            navigate(`/orderProduct`, {state: {SellerInventoryIDs: selectedIds}})
                            : navigate('/userLogin');
                        }}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                    >
                        <i className="fas fa-shopping-cart mr-2"></i> Buy Now
                    </button>}
                </div>}
            </div>
        </>
    );
}
