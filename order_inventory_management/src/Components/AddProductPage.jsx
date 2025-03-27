import React, { useState, useEffect } from 'react';
import productCategories from '../Data/ProductTypeAttributes';

function AddProduct() {

    const [form, setForm] = useState({
        Name: '',
        Description: '',
        Price: '',
        Discount: 0,
        Category: '',
        ProductType: '',
        Quantity: '',
        Specifications: {

        },
        images: [], // Array to hold image files
        SellerId: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleAttributeChange = (e) => {
        setForm({
            ...form,
            Specifications: {
                ...form.Specifications,
                [e.target.name] : e.target.value
            }
        })
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log('Selected files:', files); // Log selected files
        setForm({
            ...form,
            images: files // Store selected files
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        return;
        console.log('Form images before FormData:', form.images); 
        const formData = new FormData(); // Create FormData object
    
        // Append form fields to FormData
        for (const key in form) {
            if (key === 'images') {
                form.images.forEach((file) => {
                    formData.append('images', file); // Append each image file
                });
            } else if (key === 'Specifications') {
                // Serialize Specifications before appending
                formData.append('Specifications', JSON.stringify(form[key])); // Ensure it is a string
            } else {
                formData.append(key, form[key]); // Append other fields
            }
        }
    
        // Log FormData for debugging
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
    
        const response = await fetch('http://localhost:8000/sellers/addProduct', {
            method: 'POST',
            body: formData // Use FormData as the body
        });
        
        const result = await response.json();
        if(response.ok) {
            alert('Product added sucessfully');
        } else {
            alert('Error occured while adding product');
        }
        console.log(result);
    };

    const productTypes = form.Category ? Object.keys(productCategories[form.Category]?.productTypes || {}) : [];

    // const dynamicAttributes = form.ProductType ? Object.keys(productCategories[form.Category]?.productTypes[form.ProductType]?.attributes || {}) : [];

    const dynamicAttributes = form.ProductType ? (productCategories[form.Category]?.productTypes[form.ProductType]?.attributes || []) : [];


    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
    {/* Add Product Form */}
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

            {/* Basic Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Enter product name" 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input 
                        type="text" 
                        name="brand" 
                        placeholder="Enter brand name" 
                        onChange={handleAttributeChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                    name="Description" 
                    placeholder="Enter product Description" 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>

            {/* Pricing and Discounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input 
                        type="number" 
                        name="Price" 
                        placeholder="Enter Price" 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                    <input 
                        type="number" 
                        name="Discount" 
                        placeholder="Enter discount percentage" 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                        name="Category" 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Category</option>
                        {Object.keys(productCategories).map((Category, index) => (
                            <option key={index} value={Category}>{Category}</option>
                        ))}
                    </select>
                </div>

                {productTypes.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                        <select 
                            name="ProductType" 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Product Type</option>
                            {productTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Specifications */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700">Specifications</h3>
                {dynamicAttributes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dynamicAttributes.map((attribute, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700">{attribute.name}</label>
                                <input 
                                    type={attribute.type === 'number' ? 'number' : 'text'} 
                                    name={attribute.name} 
                                    placeholder={`Enter ${attribute.name}`} 
                                    onChange={handleAttributeChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quantity and Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input 
                        type="number" 
                        name="Quantity" 
                        placeholder="Enter Quantity" 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                    <input 
                        type="file" 
                        name="images" 
                        multiple 
                        onChange={handleFileChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    Add Product
                </button>
            </div>
        </form>
    </div>
</div>

        </>
    )
}

export default AddProduct;