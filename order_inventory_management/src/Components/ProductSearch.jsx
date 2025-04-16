import React, { useState } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductSearch = () => {
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetails, setProductDetails] = useState({
        price: '',
        discount: '',
        quantity: '',
    });

    // Function to fetch product suggestions
    const onSuggestionsFetchRequested = ({ value }) => {
        axios.get(`http://localhost:8000/products/search?keyword=${value}`,
            {
                withCredentials: true // ✅ move it here!
            })
            .then(response => setSuggestions(response.data))
            .catch(err => console.error("Error fetching products:", err));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (event, { newValue }) => {
        setSearchValue(newValue);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        setSelectedProduct(suggestion);
        setProductDetails({
            ...productDetails,
            price: '',
            discount: '',
            quantity: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { price, discount, quantity } = productDetails;
        axios.post("http://localhost:8000/sellers/addExisProduct", {
            ProductID: selectedProduct.ProductID,
            Price: price,
            Discount: discount,
            Quantity: quantity,
        },
        {
            withCredentials: true // ✅ move it here!
        })
        .then(response => {
            toast.success("Product added successfully");
            console.log("Product added successfully:", response);
        })
        .catch(err => console.error("Error adding product:", err));
    };

    const inputProps = {
        placeholder: "Search for a product...",
        value: searchValue,
        onChange: onChange
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h3 className="text-2xl font-semibold mb-4 text-center">Search for a Product to Sell</h3>
    
            <div className="mb-6">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={(suggestion) => suggestion.Name}
                    renderSuggestion={(suggestion) => (
                        <div className="p-2 hover:bg-gray-100 border-b text-sm">
                            {suggestion.Name} - <span className="text-gray-500">{suggestion.Brand}</span>
                        </div>
                    )}
                    inputProps={{
                        ...inputProps,
                        className: "w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }}
                    onSuggestionSelected={onSuggestionSelected}
                />
            </div>
    
            {selectedProduct && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
                >
                    <h4 className="text-xl font-semibold mb-4">{selectedProduct.Name}</h4>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="number"
                            value={productDetails.price}
                            onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                            placeholder="Price"
                            required
                            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={productDetails.discount}
                            onChange={(e) => setProductDetails({ ...productDetails, discount: e.target.value })}
                            placeholder="Discount"
                            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={productDetails.quantity}
                            onChange={(e) => setProductDetails({ ...productDetails, quantity: e.target.value })}
                            placeholder="Quantity"
                            required
                            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add Product
                    </button>
                </form>
            )}
        </div>
    );
    
};

export default ProductSearch;
