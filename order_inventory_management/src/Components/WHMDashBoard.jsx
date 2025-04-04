import React from 'react';

export default function WHMDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar (Header) */}
      <aside className="w-1/5 bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Warehouse Manager</h1>
        <h2 className="text-2xl font-bold text-red-600 mt-2">[WHM Name]</h2>
        <p className="text-gray-600 mt-4">Manage inventory, track shipments, and monitor stock levels.</p>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg text-gray-700 font-semibold">Total Products</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">1,230</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg text-gray-700 font-semibold">Low Stock Alerts</h2>
            <p className="text-3xl font-bold text-red-500 mt-2">15</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg text-gray-700 font-semibold">Incoming Shipments</h2>
            <p className="text-3xl font-bold text-yellow-500 mt-2">6</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg text-gray-700 font-semibold">Warehouses</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">3</p>
          </div>
        </div>

        {/* Stock Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stock Overview</h2>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">[Stock Table / Chart Placeholder]</p>
          </div>
        </section>

        {/* Shipment Status */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipment Status</h2>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">[Shipment tracking list or progress bar]</p>
          </div>
        </section>
      </main>
    </div>
  );
}
