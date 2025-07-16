import { React, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import { getFirstImage } from '../functions/func';
import { UserContext } from '../Context/UserContext';

export default function OrderPage() {
  const [orderedProducts, setOrderedProducts] = useState([]);

  const [oProducts, setOproducts] = useState([]);
  const location = useLocation();
  const sellerInventoryIDs = location.state?.SellerInventoryIDs || [];
  const [customer, setCustomer] = useState();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrderedProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/products/getByIds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: sellerInventoryIDs }) // sellerInventoryIDs is an array
        });

        const result = await response.json();

        if (response.ok) {
          setOrderedProducts(result.products);
          const productsWithQuantity = result.products.map(p => ({
            SellerInventoryID: p.SellerInventoryID,
            Quantity: 1,
            Price: Math.round(p.Price - p.Price * (p.Discount / 100))
          }));
          setOproducts(productsWithQuantity);
        } else {
          toast.warn(`⚠️ Error fetching products: ${result.message}`);
        }
      } catch (error) {
        toast.error('❌ Network error while fetching products');
      }
    };

    fetchOrderedProducts();
  }, [sellerInventoryIDs]); // run when sellerInventoryIDs changes  

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`http://localhost:8000/customers/customerDetails`, {
        withCredentials: true
      })
        .then((res) => {
          setCustomer(res.data); // ✅ Store only the response data
        })
        .catch((err) => {
          toast.error("Error fetching user details");
          setCustomer(null); // Ensure state is handled on error
        });
    }

  }, [user, isLoggedIn]); // Ensure dependencies include isLoggedIn and user   

  // Calculate all prices
  const calculateSubtotal = () =>
    oProducts.reduce(
      (sum, p) =>
        sum + p.Quantity * p.Price,
      0
    );

  const calculatePlatformFee = () => oProducts.length * 3;

  const calculateDeliveryFee = () => (calculateSubtotal() > 500 ? 0 : 40);

  const calculateTotal = () =>
    Number(calculateSubtotal() + calculatePlatformFee() + calculateDeliveryFee());

  // Place Order Function (API logic can be added here)
  const placeOrder = async () => {
    try {
      const response = await fetch("http://localhost:8000/products/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerID: user._id,
          ShippingAddressID: customer.addresses[0].AddressID,
          items: oProducts,
          TotalAmount: calculateTotal(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Order placed successfully!");
        navigate('/customerDash', { replace: true});
      } else {
        toast.error(`⚠️ Order failed: ${result.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Shipping Address Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Shipping Address</h3>
          {customer && (
            customer.addresses.map(address => (
              <div key={address.AddressID}>
                <p>{address.AddressType}</p>
                <p className="text-gray-600">{address.Landmark}, {address.Street}, {address.City}, {address.State} - {address.Zip}</p>
              </div>
            ))
          )}
        </div>
        <div className="max-w-3xl mx-auto p-6">
          {orderedProducts.map(product => (
            <div key={product.SellerInventoryID || product.ProductID} className="space-y-4 mb-6">
              <div
                className="flex bg-gray-50 p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition ease-in-out cursor-pointer"
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 mr-4 p-2 bg-gray-100 rounded-lg">
                  {product.images ? (
                    <img
                      src={getFirstImage(product.images)}
                      alt={product.ProductName}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3
                    className="text-lg font-semibold text-gray-800"
                    onClick={() => {
                      const type = "seller";
                      navigate(`/visit/${product.SellerInventoryID}?type=${type}`);
                    }}
                  >{product.Name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Brand: {product.Brand}</p>
                  <p className="text-sm text-gray-600 mt-1">₹{product.Price}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Discount: ₹{Math.round(product.Price * (product.Discount / 100))}
                  </p>
                  <p className="text-green-600 font-bold text-md mt-2">
                    {(() => {
                      const match = oProducts.find(p => p.SellerInventoryID === product.SellerInventoryID);
                      const unitPrice = Math.round(product.Price - product.Price * (product.Discount / 100));
                      const quantity = match ? parseInt(match.Quantity) : 1;
                      return `Final Price (${quantity} × ₹${unitPrice}): ₹${quantity * unitPrice}`;
                    })()}
                  </p>


                  {/* Quantity Buttons */}
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex items-center space-x-2">
                      {/* Decrease Button */}
                      <button
                        onClick={() =>
                          setOproducts(prev =>
                            prev.map(item =>
                              item.SellerInventoryID === product.SellerInventoryID
                                ? { ...item, Quantity: Math.max(1, item.Quantity - 1) }
                                : item
                            )
                          )
                        }
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        −
                      </button>

                      {/* Quantity Display */}
                      <span className="min-w-[24px] text-center">
                        {
                          oProducts.find(p => p.SellerInventoryID === product.SellerInventoryID)?.Quantity || 1
                        }
                      </span>

                      {/* Increase Button */}
                      <button
                        onClick={() =>
                          setOproducts(prev =>
                            prev.map(item =>
                              item.SellerInventoryID === product.SellerInventoryID
                                ? { ...item, Quantity: item.Quantity + 1 }
                                : item
                            )
                          )
                        }
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        +
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          {orderedProducts.length > 0 && (
            <div className="bg-white p-6 border border-gray-300 rounded-lg mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Subtotal (after discounts):</span>
                <span>₹{calculateSubtotal()}</span>
              </div>

              {/* Platform Fee */}
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Platform Fee (₹3 × {orderedProducts.length}):</span>
                <span>₹{calculatePlatformFee()}</span>
              </div>

              {/* Delivery Charges */}
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Delivery Charge:</span>
                <span className={calculateDeliveryFee() === 0 ? "text-green-600 font-medium" : ""}>
                  ₹{calculateDeliveryFee()} {calculateDeliveryFee() === 0 && "(Free)"}
                </span>
              </div>

              <hr className="my-2 border-t border-gray-300" />

              {/* Grand Total */}
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>

              {/* Place Order Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={placeOrder}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition ease-in-out"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
