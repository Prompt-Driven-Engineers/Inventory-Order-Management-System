import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function ProductPage({isLoggedIn, user}) {
    const { productId } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [product, setProduct] = useState(null); // Initialize with null to handle loading state
    const navigate = useNavigate();
    const [wislisted, setWishlisted] = useState(false);
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
            console.log(result);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };    

    const checkIfwishListed = async() => {
        // const response = await fetch('http://localhost:8000/users//isWishlist', {
        //    method: 'POST',
        //    body: JSON.stringify({
        //         customerId: user._id,
        //         productId
        //    }),
        //    headers: {
        //     'Content-Type': 'application/json'
        //    } 
        // });

        // // const result = await respose.json();
        // const result = await response.json();
        // if(response.ok) {
        //     setWishlisted(result.isCarted);
        // } else {
        //     console.log('Error occured while finding in cart');
        // }
    }

    const addToWishlist = async () => {
        if (!product?.ProductID) {
            console.warn("Product ID is missing");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8000/customers/addToWishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // keep cookies/session
                body: JSON.stringify({
                    productId,
                    type,
                    isCarted: !carted
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setWishlisted(true);
                console.log('✅ Product added to wishlist successfully');
            } else {
                console.warn('⚠️ Failed to add product to wishlist:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('❌ Error adding to wishlist:', error);
        }
    };    

    const removeFromWishlist = async() => {
        // const response = await fetch('http://localhost:3000/users/removeFromWishlist',
        //     {
        //         method: 'POST',
        //         body: JSON.stringify ({
        //             customerId: user._id,
        //             productId: product._id
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // );
        // // const result = await response.json();
        // if(response.ok) {
        //     setWishlisted(false);
        //     console.log('Product removed from wishlist successfully');
        // } else if(response.status === 400) {
        //     console.log('CustomerId and ProductId is required');
        // } else if(response.status === 404) {
        //     console.log('Product not found in wishlist');
        // } else {
        //     console.log('Error occured while removing product from wishlist');
        // }
    }

    const addToCart = async() => {
        // if(isLoggedIn) {
        //     try{
        //         const response = await fetch('http://localhost:3000/users/addToCart',
        //             {
        //                 method: 'POST',
        //                 body: JSON.stringify({
        //                     customerId: user._id,
        //                     productId: product._id
        //                 }),
        //                 headers: {
        //                     'Content-Type': 'application/json'
        //                 }
        //             }
        //         )
        //         if(response.ok) {
        //             setCarted(true);
        //             console.log('Product added to cart successfully');
        //         } else if(response.status === 400) {
        //             console.log('Product alredy exist in Cart');
        //         } else {
        //             console.log('Error occured while adding the product');
        //         }
        //     } catch(error) {
        //         console.log(error);
        //     }
        // } else {
        //     navigate('/customerLogin');
        // }
    }

    const checkIfCarted = async() => {
        // try{
        //     const response = await fetch('http://localhost:3000/users/isCarted',{
        //         method: 'POST',
        //         body: JSON.stringify({
        //             customerId: user._id,
        //             productId: productId
        //         }),
        //         headers: {
        //             'Content-Type' : 'application/json'
        //         }
        //     });
        //     const result = await response.json();
        //     if(response.ok) {
        //         setCarted(result.isCarted);
        //     } else {
        //         console.log('Error occured while finding in cart');
        //     }
        // } catch(error) {
        //     console.log(error);
        // }
    }

    const handleOrder = async() => {
        // if(isLoggedIn) {
        //     try{
        //         const response = await fetch('http://localhost:3000/users/takeOrder',
        //             {
        //                 method: 'POST',
        //                 body: JSON.stringify({
        //                     customerId: user._id,
        //                     productId: product._id
        //                 }),
        //                 headers: {
        //                     'Content-Type': 'application/json'
        //                 }
        //             }
        //         )
        //         if(response.ok) {
        //             setWishlisted(true);
        //             console.log('Ordered successfully');
        //         } else {
        //             console.log('Error occured while ordering the product');
        //         }
        //     } catch(error) {
        //         console.log(error);
        //     }
        // } else {
        //     navigate('/customerLogin');
        // }
    }

    // Call fetchById on component mount
    useEffect(() => {
        fetchById();  // Call the function correctly
    }, [productId]);  // Add productId as dependency to refetch if the ID changes

    useEffect(() => {
        if(isLoggedIn) {
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-4 rounded-lg shadow-lg mb-6">
            <p className="text-xl font-bold">Exclusive Offer: Get 20% off on this product!</p>
        </div>

        {/* Images */}
        <div className="flex flex-wrap justify-start mb-6 space-x-4">
            {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                    <img
                        key={index}
                        // src={`http://localhost:3000/${image}`} // Accessing the correct URL path
                        alt={`${product.Name} image ${index + 1}`}
                        className="w-48 h-48 object-cover rounded-md m-2 shadow-md transform transition-transform duration-200 hover:scale-105"
                    />
                ))
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
                    <div className="text-3xl text-green-600 font-bold">₹{Math.round(product.Price - (product.Price * (product.Discount/100)))}/-</div>
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
                    {wislisted ? (
                        <button
                            onClick={() => { isLoggedIn ? removeFromWishlist() : navigate('/userLogin')}}
                            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center"
                        >
                            <i className="fas fa-heart mr-2"></i> Liked
                        </button>
                    ) : (
                        <button
                            onClick={() => { isLoggedIn ? addToWishlist() : navigate('/userLogin')}}
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
                                onClick={() => { isLoggedIn ? addToCart() : navigate('/userLogin') }}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                            >
                                <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                            </button>
                        )
                    )}
                    
                    {product.SellerID && <button
                        onClick={() => { isLoggedIn ?
                            navigate(`/orderProduct/${productId}`) : navigate('/userLogin')}}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center"
                    >
                        <i className="fas fa-shopping-cart mr-2"></i> Buy Now
                    </button>}
                </div>}
            </div>
        </>
    );
}
