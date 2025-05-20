import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirstImage } from "../functions/func";

export default function ProductList() {
  const { type } = useParams(); // Get the product type from the URL
  const { category } = useParams(); // Get the product type from the URL
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { searchedProduct } = useParams(); // Get the product type from the URL
  const [currentPrdctType, setCurrentPrdctType] = useState('');
  const [dynamicAttributes, setDynamicAttributes] = useState([]);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const { filterForm } = useParams();

  useEffect( () => {
    if (searchedProduct) {
      fetchByName();
    }
  }, [searchedProduct]);

  const fetchByName = async() => {
    setFilteredProducts([]);
    const response = await fetch(`http://localhost:8000/products/getByName?name=${searchedProduct}`, {
        method: 'GET',
        headers:  {
          'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    setFilteredProducts(result.length ? result : []);
  }

  // const dynamicAttributes = currentPrdctType ? (productCategories.productTypes[currentPrdctType]?.attributes || []) : [];

  const handleFilterChange = (e) => {
    setForm({
        ...form,
        productType: currentPrdctType,
        attributes: {
            ...form.attributes,
            [e.target.name] : e.target.value
        }
    });
  }

  const handleApplyFilter = async(e) => {
    e.preventDefault();
    
  }
    
  return (
    <div className="flex w-full">

      {/* Product List Section */}
      <div className="px-4 w-full">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-5 rounded-lg mb-6 shadow-md text-white text-center">
          <h2 className="text-3xl font-semibold">Explore the Best Deals on Products!</h2>
          <p className="mt-2 text-lg">Find what you love at unbeatable prices.</p>
        </div>

        {type && <h2 className="text-2xl font-bold text-gray-800 mb-6">Products in {type}</h2>}
        {category && <h2 className="text-2xl font-bold text-gray-800 mb-6">Products in {category}</h2>}

        {/* Product Display */}
        <div className="w-full">
          {filteredProducts.length ? (
            <ul className="w-full">
              {filteredProducts.map((product, index) => (
                <li
                  key={index}
                  onClick={() => {
                    const id = product.SellerInventoryID || product.ProductID;
                    const type = product.SellerInventoryID ? "seller" : "product";
                    navigate(`/visit/${id}?type=${type}`);
                  }}                  
                  className="flex items-center bg-white my-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all ease-in-out cursor-pointer"
                >
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

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800">{product.Name}</h3>
                    {/* <p className="text-gray-600 mt-1 line-clamp-2">{product.Description}</p> */}
                    <p className="text-gray-500 mt-1">Brand: {product.Brand}</p>
                    {product.Price && <p className="text-green-600 font-bold mt-2">
                      ₹{product.Price} &nbsp;
                      <span className="line-through text-red-500">
                        ₹
                        {Math.round(
                          product.Price / (1 - product.Discount / 100)
                        )}
                      </span>
                    </p>}
                    {product.CurrentStock && <p className="text-red-600 mt-2">Only {product.CurrentStock} left</p>}
                    {product.comingSoon && <p className="text-green-600 font-bold mt-2">Comming soon</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-lg text-gray-600">No products found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
