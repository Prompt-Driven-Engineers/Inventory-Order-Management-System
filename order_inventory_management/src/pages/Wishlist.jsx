import React, { useState, useContext, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function Wishlist() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(UserContext);

    const fetchWishlist = async() => {
        if (!user || user.role !== 'Customer') return; // Only fetch for Customers

        try {
            const response = await fetch('http://localhost:8000/customers/getWishlist', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setProducts(result.wishlistedProducts || []);
            } else {
                console.log('Error occurred:', result.message);
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    }

    const removeFromWishlist = async(WishlistID) => {
        if (!user || user.role !== 'Customer') return; // Only fetch for Customers
        try {
            const response = await fetch('http://localhost:8000/customers/removeFromWishlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    WishlistID
                })
            });
    
            const data = await response.json();
            fetchWishlist();
            if (response.ok) {
                console.log(`✅ ${data.message}`);
            } else {
                console.warn('⚠️ Failed to update Wishlist:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('❌ Error updating Wishlist:', error);
        }
    }

    const getFirstImage = (imagesString) => {
        try {
          const imagesArray = JSON.parse(imagesString);
          return imagesArray.length > 0 ? imagesArray[0] : null;
        } catch (error) {
          console.error("Invalid images format", error);
          return null;
        }
    };

    useEffect(() => {
        if(isLoggedIn) {
            fetchWishlist();
        }
    }, [isLoggedIn, user]);

    return (
        <>
           {/* Banner-like Header */}
            <div className="bg-blue-600 text-white py-4 text-center">
                <h2 className="text-3xl font-semibold">Your Wishlist</h2>
                <p className="text-sm mt-2">Keep track of your favorite items and come back anytime to make a purchase!</p>
            </div>

            {/* Wishlist Section */}
            <div className="space-y-6 mt-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.WishlistID} className="flex items-start justify-between p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            
                            {/* Product Image and Details */}
                            <div className="flex items-start space-x-6">
                                {/* Product Image */}
                                <div className="w-24 h-24 flex-shrink-0 mr-4 p-2 bg-gray-100 rounded-lg">
                                    {getFirstImage(product.images) ? (
                                        <img
                                            src={getFirstImage(product.images)}
                                            alt={product.Name}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                        ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                            <span className="text-gray-500 text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Information */}
                                <div 
                                    className="space-y-2 flex-1"
                                    onClick={() => {
                                        if(product.sellerinventoryid) navigate(`/visit/${product.SellerInventoryID}?type=seller`);
                                        else if(product.ProductID) navigate(`/visit/${product.ProductID}?type=product`);
                                    }}
                                >
                                    <h4 className="text-lg font-medium">{product.Name}</h4>
                                    <p className="text-gray-500">
                                        Price: ₹{Math.round(product.Price - (product.Price * (product.Discount / 100)))}
                                        {product.Discount > 0 && (
                                            <span className="ml-2 text-green-500">-{product.Discount}% Off</span>
                                        )}
                                    </p>
                                    
                                    {product.Discount && (
                                        <p className="text-sm text-green-600">Discount: {product.Discount}% off</p>
                                    )}

                                    {/* Product Rating (Stars) */}
                                    <div className="flex items-center">
                                        <span className="text-yellow-400">★★★★☆</span> {/* Placeholder for star rating */}
                                    </div>

                                    <p className="text-sm text-gray-700">{product.Description}</p>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => removeFromWishlist(product.WishlistID)}
                                    className="px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Remove from Wishlist
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Your wishlist is empty!</p>
                        <button className="mt-4 text-blue-500 underline">Browse Products</button>
                    </div>
                )}
            </div>
                {/* Suggested Products Section */}
                <div className="bg-gray-100 py-8 mt-10 rounded-lg">
                    <h3 className="text-xl font-semibold text-center mb-6">You Might Also Like</h3>
                    <div className="flex justify-center space-x-6">
                        {/* Sample Suggested Products */}
                        <div className="w-48 bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                            <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden mb-4">
                                <img
                                    src="suggested-product-image.jpg"
                                    alt="Suggested Product 1"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-lg font-medium">Product Name 1</p>
                            <p className="text-gray-500">₹999</p>
                            <button className="mt-2 w-full text-sm text-blue-600 underline">View Details</button>
                        </div>
                        
                        {/* Repeat similar blocks for more suggested products */}
                    </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="text-center my-10">
                    <button 
                        onClick={() => navigateToShop()} 
                        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Footer Section */}
                <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
                                <p className="text-sm">Email: support@example.com</p>
                                <p className="text-sm">Phone: +1 (800) 123-4567</p>
                            </div>
                            
                            {/* Useful Links */}
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                                <ul className="space-y-1">
                                    <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:underline">Terms of Service</a></li>
                                    <li><a href="#" className="hover:underline">Return Policy</a></li>
                                </ul>
                            </div>
                            
                            {/* Social Media Links */}
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="hover:text-white">Facebook</a>
                                    <a href="#" className="hover:text-white">Twitter</a>
                                    <a href="#" className="hover:text-white">Instagram</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
    )
}
