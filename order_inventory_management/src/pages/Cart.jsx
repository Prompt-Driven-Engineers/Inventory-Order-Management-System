import {React, useState, useEffect, useContext} from 'react';
import {useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirstImage } from "../functions/func";
import { fetchCustomer } from '../apiCall/customer';
import { UserContext } from '../Context/UserContext';

export default function Cart() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); 
    const [customer, setCustomer] = useState();
    const { isLoggedIn, user } = useContext(UserContext);

    const fetchCart = async () => {
        if (!user || user.role !== 'Customer') return; // Only fetch for Customers
    
        try {
            const response = await fetch('http://localhost:8000/customers/getCart', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setProducts(result.cartedProducts || []);
            } else {
                console.log('Error occurred:', result.message);
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    const removeFromCart = async(SellerInventoryID) => {
        if (!user || user.role !== 'Customer') return; // Only fetch for Customers
        try {
            const response = await fetch('http://localhost:8000/customers/handleCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    SellerInventoryID,
                    isCarted: false  // Corrected the spelling
                })
            });
    
            const data = await response.json();
            fetchCart();
            if (response.ok) {
                console.log(`✅ ${data.message}`);
            } else {
                console.warn('⚠️ Failed to update Cart:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('❌ Error updating Cart:', error);
        }
    }

    const handleChangeQuantity = async(SellerInventoryID, newQuantity) => {
        if(!isLoggedIn || user?.role !== 'Customer') return;

        try {
            const response = await fetch('http://localhost:8000/customers/changeCartQuantity', {
                method: 'PUT',
                body: JSON.stringify({
                    SellerInventoryID,
                    newQuantity 
                }),
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            const result = await response.json();
            if(response.ok) {
                fetchCart();
                console.log('Quantity changed successfully');
            } else if(response.status === 404) {
                console.log('Product not found');
            } else {
                console.log(result.error);
                console.log('Error ocuured in dbs while changing quantity');
            }
        } catch(error) {
            console.log(error);
        }
    }

    const calculateTotalPrice = () => {
        return products.reduce((total, product) => {
            const finalPrice = product.Price - (product.Price * (product.Discount / 100)); // Discounted price
            return total + (finalPrice * product.Quantity); // Multiply by quantity
        }, 0);
    };

    const placeOrder = async() => {
        const selectedIds = products.map((product) => product.SellerInventoryID);
        isLoggedIn ? 
        navigate(`/orderProduct`, {state: {SellerInventoryIDs: selectedIds}}) 
        : navigate('/userLogin');
    }
      

    useEffect(() => {
        async function fetchData () {
            try{
                if(isLoggedIn) {
                    await fetchCart();
                    const user = await fetchCustomer();
                    setCustomer(user);
                }
            } catch(err) {
                console.error("Error fetching customer/cart", err);
            }
        }
        fetchData();
    }, [isLoggedIn]);

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
                { customer?.addresses && customer.addresses.length > 0 ? (
                    <div>
                        <p className="text-gray-700">
                            {customer.addresses[0].Street}, {customer.addresses[0].City}, {customer.addresses[0].State}, {customer.addresses[0].Country} - {customer.addresses[0].Zip
                            }
                        </p>
                        <p className="text-gray-700">Landmark: {customer.addresses[0].Landmark}</p>
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
            product && (
                <div
                    key={product.ProductID}
                    className="flex justify-between items-start p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                >
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

                {/* Product Details */}
                <div 
                    className="flex-1 px-6"
                    onClick={() => {navigate(`/visit/${product.SellerInventoryID}?type=seller`);}}
                >
                    <h3 className="text-lg font-semibold">{product.Name}</h3>
                    <p className="text-sm text-gray-500">Brand: {product.Brand}</p>
                    <p className="text-sm text-gray-500">
                        Price: ₹{Math.round(product.Price - (product.Price * (product.Discount / 100)))}
                        {product.Discount > 0 && (
                            <span className="ml-2 text-green-500">-{product.Discount}% Off</span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{product.Description}</p>
                    <p className="text-sm text-red-500">Only {product.CurrentStock} left</p>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Qty:</span>
                    <input
                        type="number"
                        onChange={(e) => {
                            if(parseInt(e.target.value) > product.CurrentStock) {
                                toast.warn(`Only ${product.CurrentStock} products is available`);
                            } else {
                                handleChangeQuantity(product.SellerInventoryID, parseInt(e.target.value || 1));
                            }
                        }}
                        // value={product.Quantity || 1}
                        placeholder={product.Quantity}
                        min={1}
                        max={product.CurrentStock}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:border-blue-400"
                    />
                    </div>

                    <button
                    onClick={() => removeFromCart(product.SellerInventoryID)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                    Remove
                    </button>
                </div>
                </div>
            )
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
        <div 
            className='flex items-center bg-blue-500 text-white px-3 py-2 font-bold rounded-md hover:bg-blue-600 transition-all duration-300'
            onClick={placeOrder}
        >
            Order Now
        </div>
    </div>

</div>



    </>
    

    )
}
