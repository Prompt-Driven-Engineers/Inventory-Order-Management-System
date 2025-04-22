import {React, useState, useEffect, useContext} from 'react';
import {useNavigate } from 'react-router-dom';

export default function Cart({isLoggedIn, user}) {
    const [products, setProducts] = useState([]);
    // const [quantity, setQuantity] = useState(1);
    const [currentProduct, setCurrentProduct] = useState({productId: '', quantity: 1});
    // const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate(); 

    const fetchCart = async() => {
        // if (!user || !user._id) return; // Ensure user exists
        // try {
        //     const response = await fetch(`http://localhost:3000/users/getCart?userId=${user._id}`,{
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     const result = await response.json();
        //     if(response.ok) {
        //         console.log(result.items);
        //         setProducts(result.items || []);
        //     } else {
        //         console.log('Error occured');
        //     }
        // } catch(error) {
        //     console.log(error);
        // }
    }

    const removeFromCart = async(productId) => {
        // if(!isLoggedIn) {
        //     return;
        // }
        // const response = await fetch('http://localhost:3000/users/removeFromCart',
        //     {
        //         method: 'POST',
        //         body: JSON.stringify ({
        //             customerId: user._id,
        //             productId
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // );
        // // const result = await response.json();
        // if(response.ok) {
        //     fetchCart();
        //     console.log('Product removed from wishlist successfully');
        // } else if(response.status === 400) {
        //     console.log('CustomerId and ProductId is required');
        // } else if(response.status === 404) {
        //     console.log('Product not found in wishlist');
        // } else {
        //     console.log('Error occured while removing product from wishlist');
        // }

    }

    const handleChangeQuantity = async() => {
        // if(!isLoggedIn) {
        //     return;
        // }
        // try {
        //     console.log(currentProduct.quantity);
        //     const response = await fetch('http://localhost:3000/users/changeQuantity', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             customerId: user._id,
        //             productId: currentProduct.productId,
        //             quantity: currentProduct.quantity 
        //         }),
        //         headers: {
        //             'Content-Type' : 'application/json'
        //         }
        //     });
        //     const result = await response.json();
        //     if(response.ok) {
        //         fetchCart();
        //         console.log('Quantity changed successfully');
        //     } else if(response.status === 404) {
        //         console.log('Product not found');
        //     } else {
        //         console.log(result.error);
        //         console.log('Error ocuured in dbs while changing quantity');
        //     }
        // } catch(error) {
        //     console.log(error);
        // }
    }

    const calculateTotalPrice = () => {
        return products.reduce((total, { productId, quantity }) => {

            const finalPrice = productId ? productId.price - (productId.price * (productId.discountPercentage / 100)) : 0; // Final price after applying discount
    
            return total + (finalPrice * quantity); // Multiply by quantity
        }, 0);
    };
    
    

    const placeOrder = async() => {

    }

    useEffect(() => {
        if(isLoggedIn) {
            fetchCart();
        } 
        // else {
        //     navigate('/customerLogin');
        // }
    }, [isLoggedIn, user]);

    useEffect(() => {
        if(isLoggedIn) {
            handleChangeQuantity();
        }
    }, [currentProduct]);

    // useEffect(()=> {
    //     if(isLoggedIn) {
    //         calculateTotalPrice();
    //     }
        
    // }, [products]);

    return (
        <>
       {/* Promotional Banner */}
        <div className="w-full bg-blue-600 text-white text-center py-4 rounded-t-lg shadow-lg">
            <p className="text-lg font-semibold">🎉 Free Shipping on Orders Over ₹5000! 🎉</p>
            <p className="text-sm">Use code <span className="font-bold">FREESHIP</span> at checkout.</p>
        </div>

        {/* Cart Container */}
        <div className="max-w-full mx-auto p-3 bg-gray-100 rounded-lg mt-6 min-h-screen">
            {/* User Address */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
                { user.addresses && user.addresses.length > 0 ? (
                    <div>
                        <p className="text-gray-700">
                            {user.addresses[0].label}, {user.addresses[0].street}, {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].zipCode}
                        </p>
                        <p className="text-gray-700">Landmark: {user.addresses[0].landmark}</p>
                    </div>
                ) : (
                    <div className="text-gray-500">
                        <p>No address available</p>
                        <button className="mt-2 text-blue-500 underline">Add Address</button>
                    </div>
                )}
            </div>

    {/* Cart Title */}
    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Shopping Cart</h2>

    {/* Cart Items */}
    <div className="space-y-6 px-4 md:px-8">
        {products.length > 0 ? (
            products.map((product) => (
                ((product && product.productId) && <div 
                    key={product.productId._id} 
                    className="flex justify-between items-start p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
                    <div className="w-24 h-24 flex-shrink-0 mr-4 p-2 bg-gray-100 rounded-lg">
                        {product.productId.images && product.productId.images.length > 0 ? (
                            <img
                            src={`http://localhost:3000/${product.productId.images[0]}`} // Show the first image
                            alt={product.productId.name}
                            className="w-full h-full object-contain rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 px-6">
                        <h3 className="text-lg font-semibold">{product.productId.name}</h3>
                        <p className="text-sm text-gray-500">Brand: {product.productId.brand}</p>
                        <p className="text-sm text-gray-500">
                            Price: ₹{Math.round(product.productId.price - (product.productId.price * (product.productId.discountPercentage/100)))}
                            {product.productId.discountPercentage > 0 && (
                                <span className="ml-2 text-green-500">
                                    -{product.productId.discountPercentage}% Off
                                </span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{product.productId.description}</p>
                        <p className="text-sm text-gray-500">Stock: {product.productId.stock}</p>
                    </div>

                    {/* Quantity Input */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Qty:</span>
                            <input
                                type="number"
                                onChange={(e) => {
                                    const newQuantity = e.target.value ? Math.max(1, Number(e.target.value)) : 1;
                                    setCurrentProduct({
                                        productId: product.productId._id, 
                                        quantity: newQuantity
                                    });
                                }}
                                value={product.quantity || 1}
                                min={1}
                                max={product.productId.stock}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {/* Remove Button */}
                        <button 
                            onClick={() => removeFromCart(product.productId._id)} 
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>)
            ))
        ) : (
            <div className="text-center text-gray-500">
                <p>Your cart is empty</p>
                <button className="mt-2 text-blue-500 underline">Add Items</button>
            </div>
        )}
    </div>

    {/* Recommended Products */}
    <div className="bg-gray-100 py-8 mt-10 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-6">Recommended For You</h3>
        <div className="flex justify-center space-x-6">
            {/* Sample Recommended Products */}
            <div className="w-48 bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden mb-4">
                    <img
                        src="recommended-product-image.jpg"
                        alt="Recommended Product"
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-lg font-medium">Product Name</p>
                <p className="text-gray-500">₹1999</p>
                <button className="mt-2 w-full text-sm text-blue-600 underline">View Details</button>
            </div>
        </div>
    </div>

    {/* Footer */}
    <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-lg flex justify-between items-center">
        <div className='flex'>
            <p className="text-lg font-semibold">Total Price:</p>
            <p className="text-lg font-bold text-green-600 ml-2">₹{calculateTotalPrice().toFixed(2)}</p>
        </div>
        <div className='flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300'>
            Order Now
        </div>
    </div>

</div>



    </>
    

    )
}
