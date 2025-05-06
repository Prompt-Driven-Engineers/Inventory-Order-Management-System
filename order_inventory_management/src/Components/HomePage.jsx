import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const browseHandler = (value) => {
    if(value) {
      navigate(`/find/${searchedProduct}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md w-full">
        <h1 className="text-2xl font-bold">Inventory Manager</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:bg-black rounded-sm px-2">Home</a></li>
            <li><a href="#" className="hover:bg-black rounded-sm px-2">Products</a></li>
            <li className="relative">
              <button 
                className="hover:bg-black rounded-sm px-2" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Login
              </button>
              {showDropdown && (
                <ul className="absolute flex flex-col items-center bg-gray-200 text-black shadow-lg rounded-lg p-3 mt-2 w-30">
                  <li><a href="/adminLog" className="block px-4 py-2 hover:bg-black hover:text-white hover:rounded-lg">Admin</a></li>
                  <li><a href="/sellerLog" className="block px-4 py-2 hover:bg-black hover:text-white hover:rounded-lg">Seller</a></li>
                  <li><a href="/customerLog" className="block px-4 py-2 hover:bg-black hover:text-white hover:rounded-lg">Customer</a></li>
                  <li><a href="/whmlog" className="block px-4 py-2 hover:bg-black hover:text-white hover:rounded-lg">WareHouse Manager</a></li>
                </ul>
              )}
            </li>
            <li><a href="#" className="hover:bg-black rounded-sm px-2">Settings</a></li>
          </ul>
        </nav>
      </header>

      {/* Banner */}
      <section className="bg-blue-500 text-white text-center py-16 px-6 w-full">
        <h2 className="text-4xl font-bold mb-2">Efficient Inventory Management</h2>
        <p className="text-lg">Track and manage your stock effortlessly.</p>
      </section>

      {/* Main Content */}
      <main className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center h-40 flex items-center justify-center active:scale-95">
          <p className="text-lg text-gray-600">Feature 1</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center h-40 flex items-center justify-center">
          <p className="text-lg text-gray-600">Feature 2</p>
        </div>
        <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center h-40 flex items-center justify-center">
          <p className="text-lg text-gray-600">Feature 3</p>
        </div>
      </main>

      {/* Additional Section to Fill Body */}
      <section className="p-6 w-full bg-white shadow-md mt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Inventory System?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Real-time Tracking</h3>
            <p>Monitor stock levels and updates instantly.</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">User-Friendly Interface</h3>
            <p>Simple and intuitive design for easy navigation.</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">Detailed Reports</h3>
            <p>Get comprehensive insights on your inventory.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 w-full mt-auto">
        <p>&copy; 2025 Inventory Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
