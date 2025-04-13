import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function AllProductsList() {

    const [products, setProducts] = useState([]);



    useEffect(() => {
        axios.get('http://localhost:8000/products/allProducts', {
            withCredentials: true,
        })
        .then((res) => {
            console.log(res.data.products);
            setProducts(res.data.products);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
    

    return (
        <>
            <h1>All Products</h1>
            {products.length > 0 ? (
                <div>
                {products.map((product) => (
                    <div key={product.ProductID} className='flex'>
                        <p>Name: {product.Name}</p>
                        <p>Price: {product.Price}</p>
                    </div>
                ))}    
            </div>)
            : (
                <p>No Products found</p>
            )}
        </>
    )
}
