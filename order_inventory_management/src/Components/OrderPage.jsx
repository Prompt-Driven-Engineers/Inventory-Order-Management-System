import {React, useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function OrderPage({isUserLoggedIn}) {
    const [orderData, setOrderData] = useState({
        customerId: '',
        vendorId: '',
        shippingAddress: [],
        items: [
          {
            productId: '',
            quantity: 1,
            priceAtPurchase: 0,
          },
        ],
      });
      const { productId } = useParams();
      const [product, setProduct] = useState(null);
      const { user } = useContext(UserContext);
    
      // Handler to submit form data
      const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would send `orderData` to the backend
        console.log('Submitting Order Data:', orderData);
      };

      const fetchById = async () => {
        try {
            const response = await fetch(`http://localhost:3000/products/getById?id=${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            setProduct(result);  // Set product directly

            // Update orderData state
            setOrderData((prevOrderData) => ({
              ...prevOrderData, // Retain the existing state
              vendorId: result.vendorId, // Update vendorId
              items: [
                {
                  productId: result._id, // Assuming result._id contains the product ID
                  quantity: 1, // Default quantity
                  priceAtPurchase: Math.round(result.price - (result.price * (result.discountPercentage/100))), // Assuming result.price contains the price
                },
              ],
            }));

        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    
    useEffect(() => {
      fetchById();
    }, [productId]); // Ensure the effect runs when productId changes    

    useEffect(() => {
      if (isUserLoggedIn) {
        setOrderData((prevOrderData) => ({
          ...prevOrderData, // Spread the previous state to retain other properties
          customerId: user._id,
          shippingAddress: user.addresses, // Assign the user's addresses to shippingAddress
        }));
      }
    }, [user, isUserLoggedIn]); // Ensure dependencies include isUserLoggedIn and user   
    
    const takeOrder = async() => {
      try {
        const response = await fetch('http//localhost:3000/users/orderProduct', {
          method: 'POST',
          body: orderData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if(response.ok) {
          console.log('Order placed successfully');
        } else {
          console.log('error occured');
        }
      } catch(error) {
        console.log(error);
      }
    }

    // const <div className="w-24 h-24 flex-shrink-0 mr-4 p-2 bg-gray-100 rounded-lg"></div>

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Shipping Address Section */}
        {user && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Shipping Address</h3>
            <p className="text-gray-600">{user.addresses[0].label}, {user.addresses[0].street}, {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].zipCode}</p>
          </div>
        )}

        {/* Product Section */}
        {product && (
          <div className="space-y-4">
            <div
              onClick={() => navigate(`/visit/${product._id}`)}
              className="flex bg-gray-50 p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition ease-in-out cursor-pointer">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 mr-4 p-2 bg-gray-100 rounded-lg">
              {product.images && product.images.length > 0 ? (
                    <img
                      src={`http://localhost:3000/${product.images[0]}`} // Show the first image
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
                <p className="text-green-600 font-bold text-lg mt-2">
                  ₹{Math.round(product.price - product.price * (product.discountPercentage / 100))}/- &nbsp;
                  <span className="line-through text-red-500 text-sm">₹{product.price}</span>
                </p>
              </div>
            </div>

            {/* Price Breakdown Section */}
            <div className="bg-gray-50 p-4 border border-gray-200 rounded-md space-y-2">
              <h4 className="text-lg font-semibold text-gray-700">Price Details:</h4>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Price:</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Discount:</span>
                <span className="text-red-500">-₹{Math.round(product.price * (product.discountPercentage / 100))}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee:</span>
                <span>₹3</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges:</span>
                <span>₹40</span>
              </div>
              <hr className="border-t border-gray-300" />
              <div className="flex justify-between text-base font-semibold text-gray-800">
                <span>Total Amount:</span>
                <span>₹{Math.round(product.price - product.price * (product.discountPercentage / 100)) + 3 + 40}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={orderProduct}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition ease-in-out">
            Pay Now
          </button>
        </div>
      </form>
    </>

  )
}
