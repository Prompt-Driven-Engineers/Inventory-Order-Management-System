import { useNavigate } from 'react-router-dom';
import productCategories from '../Data/ProductTypeAttributes';

export default function UserHomePage() {

    const navigate = useNavigate();

    const allCategories = Object.keys(productCategories);
    let allProductTypes = [];
    allCategories.forEach(category => {
        const productTypes = Object.keys(productCategories[category].productTypes);
        allProductTypes = [...allProductTypes, ...productTypes];
    });
    
    const handleBrowse = (value) => {
        if(value === 'HomeAppliances') navigate(`/find/${'home appliances'}`);
        else if(value === 'AirConditioner') navigate(`/find/${'Air Conditioner'}`);
        else if(value === 'WashingMachine') navigate(`/find/${'Washing Machine'}`);
        else navigate(`/find/${value}`);
    };

    return (
        <div className="h-full bg-gray-50 py-6">

    {/* Hero/Banner Section */}
    <div className="bg-gradient-to-r from-blue-500 to-green-300 p-10 text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 ">Welcome to SecureCart!</h1>
        <p className="text-lg text-white mb-6">Find the best deals and offers on our platform</p>
        <button 
            onClick={() => handleBrowse('electronics')}
            className="bg-green-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-600 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out shadow-lg">
            Browse Now
        </button>
    </div>

    {/* Title Section */}
    <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
        Select Your Category & Product Type
    </h2>

    {/* Categories & Product Types Section */}
    <div className="px-4 flex flex-col gap-12">

        {/* Categories Section */}
        <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Categories</h3>
            <div className="flex flex-wrap justify-center gap-6">
                {allCategories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => handleBrowse(category)}
                        className="flex flex-col items-center justify-center h-40 w-40 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 "
                    >
                        <span className="text-xl font-medium">{category}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Product Types Section */}
        <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Product Types</h3>
            <div className="flex flex-wrap justify-center gap-6">
                {allProductTypes.map((productType, index) => (
                    <div
                        key={index}
                        onClick={() => handleBrowse(productType)}
                        className="flex flex-col items-center justify-center h-40 w-40 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                        <span className="text-xl font-medium">{productType}</span>
                    </div>
                ))}
            </div>
        </div>

    </div>

   
    <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
                <h4 className="text-lg font-bold mb-3">About Us</h4>
                <p className="text-gray-400">Learn more about our platform and mission to bring you the best deals.</p>
            </div>
            <div>
                <h4 className="text-lg font-bold mb-3">Contact</h4>
                <p className="text-gray-400">Email: support@securecart.com</p>
                <p className="text-gray-400">Phone: +91 12345 67890</p>
            </div>
            <div>
                <h4 className="text-lg font-bold mb-3">Quick Links</h4>
                <ul className="text-gray-400">
                    <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-bold mb-3">Stay Connected</h4>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-400">Facebook</a>
                    <a href="#" className="text-gray-400 hover:text-blue-400">Instagram</a>
                    <a href="#" className="text-gray-400 hover:text-blue-400">Twitter</a>
                </div>
            </div>
        </div>
        <div className="text-center text-gray-500 mt-8">© 2025 SecureCart. All rights reserved.</div>
    </footer>
    
</div>


    );   
}