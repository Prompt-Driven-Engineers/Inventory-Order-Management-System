import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { countries } from '../Data/Country_States';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function CustomerRegister() {

    const [form, setForm] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Phone2: '',
        Address: {
            Landmark: '',
            Street: '',
            City: '',
            State: '',
            Country: '',
            ZIP: '',
            AddressType: ''
        },
        PasswordHash: ''
    });
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const states = countries.find((c) => c.name === form.Address.Country)?.states || [];
    const navigate = useNavigate();

    const validateForm = () => {
        console.log('Inside validation');
        let newErrors = {};

        if (!form.Name.trim()) newErrors.Name = "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(form.Email)) newErrors.Email = "Enter Valid Email";
        if (!form.Email.trim()) newErrors.Email = "Email is required";
        if (!/^[1-9]\d{9}$/.test(form.Phone)) newErrors.Phone = "Enter Valid 10-digit Phone Number";
        if (!form.Phone.trim()) newErrors.Phone = "Phone Number is required";

        // Address validation
        if (!form.Address.City.trim()) newErrors.City = "City is required";
        if (!form.Address.State.trim()) newErrors.State = "State is required";
        if (!form.Address.Country.trim()) newErrors.Country = "Country is required";
        if (!form.Address.ZIP.trim() || !/^\d{6}$/.test(form.Address.ZIP)) newErrors.ZIP = "Valid 6-digit ZIP code is required";
        if (!form.Address.AddressType.trim()) newErrors.AddressType = "Address Type is required";

        // Password validation
        if (form.PasswordHash.length < 6) newErrors.PasswordHash = "Password must be at least 6 characters";
        if (!form.PasswordHash.trim()) newErrors.PasswordHash = "Password is required";

        if (form.PasswordHash !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        console.log(errors);

        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };

    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value.trim()
    });
};

const handleChangeAddress = (e) => {
    setForm({
        ...form,
        Address: {
            ...form.Address,
            [e.target.name]: e.target.value.trim()
        }
    });
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);
        if (!validateForm()) return; // Stop if validation fails

        try {
            const response = await fetch('http://localhost:8000/customers/customerReg', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            // console.log("Registration successful:", result);
            navigate('/userLogin', {replace: true});
            toast.success("Registration successful!");
        } catch (error) {
            console.error("Error during registration:", error.message);
            toast.error(error.message || "Failed to register");
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 bg-white shadow-2xl rounded-xl overflow-hidden">

                    {/* Left Side Welcome Panel */}
                    <div className="bg-blue-600 text-white p-8 flex flex-col justify-center w-full lg:w-1/3">
                        <h2 className="text-3xl font-bold mb-4">Welcome to Inventory Management</h2>
                        <p className="text-lg">Already have an account?</p>
                    </div>

                    {/* Right Side Registration Form */}
                    <div className="p-8 w-full lg:w-2/3">
                        <h2 className="font-bold text-3xl text-center text-blue-800 mb-6">Customer Registration</h2>

                        <form name="userRegForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Full Name */}
                            <div className="col-span-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="Name"
                                    placeholder="Enter your full name"
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.Name && <p className="text-red-600 text-sm mt-1">{errors.Name}</p>}
                            </div>

                            {/* Contact Info */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="Phone"
                                    placeholder="Enter your phone number"
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.Phone && <p className="text-red-600 text-sm mt-1">{errors.Phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email ID</label>
                                <input
                                    type="text"
                                    name="Email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.Email && <p className="text-red-600 text-sm mt-1">{errors.Email}</p>}
                            </div>

                            {/* Address Section */}
                            <h3 className="text-lg font-semibold text-gray-800 col-span-full mt-4">Address Information</h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Landmark</label>
                                <input
                                    type="text"
                                    name="Landmark"
                                    placeholder="Enter landmark"
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.Landmark && <p className="text-red-600 text-sm mt-1">{errors.Landmark}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Street</label>
                                <input
                                    type="text"
                                    name="Street"
                                    placeholder="Enter street"
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.Street && <p className="text-red-600 text-sm mt-1">{errors.Street}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="City"
                                    placeholder="Enter city"
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.City && <p className="text-red-600 text-sm mt-1">{errors.City}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                                <select
                                    name="Country"
                                    value={form.Address.Country}
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country.name} value={country.name}>{country.name}</option>
                                    ))}
                                </select>
                                {errors.Country && <p className="text-red-600 text-sm mt-1">{errors.Country}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                                <select
                                    name="State"
                                    onChange={handleChangeAddress}
                                    disabled={!form.Address.Country}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select State</option>
                                    {states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                {errors.State && <p className="text-red-600 text-sm mt-1">{errors.State}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    name="ZIP"
                                    placeholder="Enter ZIP code"
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.ZIP && <p className="text-red-600 text-sm mt-1">{errors.ZIP}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address Type (e.g., Home, Office)</label>
                                <input
                                    type="text"
                                    name="AddressType"
                                    placeholder="Enter address type"
                                    onChange={handleChangeAddress}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.AddressType && <p className="text-red-600 text-sm mt-1">{errors.AddressType}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        name="PasswordHash"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create your password"
                                        onChange={handleChange}
                                        className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.PasswordHash && <p className="text-red-600 text-sm mt-1">{errors.PasswordHash}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        onChange={handleChange}
                                        className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Submit */}
                            <div className="col-span-full">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow"
                                >
                                    Register as Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}