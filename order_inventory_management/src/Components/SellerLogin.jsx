import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";



export default function SellerLogin() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        Email: '',
        Password: ''
    });

    const validateForm = () => {
        console.log('Inside validation');
        let newErrors = {};
    
        if (!/\S+@\S+\.\S+/.test(form.Email)) newErrors.Email = "Enter Valid Email";
        if (!form.Email.trim()) newErrors.Email = "Email is required";
      
    
        // Password validation
        if (form.Password.length < 6) newErrors.Password = "Password must be at least 6 characters";
        if (!form.Password.trim()) newErrors.Password = "Password is required";
    
        setErrors(newErrors);
        console.log(errors);
    
        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value.trim()
        });
    }

    const handleLogin = async(e) => {
        e.preventDefault();
        console.log(form);
        if (!validateForm()) return; // Stop if validation fails
        console.log("logging in Seller");

        try{
            const response = await fetch('http://localhost:8000/sellers/sellerLogin', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok) {
                console.log(result.error || 'Something went wrong');
                alert(result.error || 'Something went wrong')
            } else {
                console.log("Login successful:", result);
                navigate(`/sellerDash`);
                alert("Login successful!"); // Show success message to the user
            }

        } catch(error) {
            console.error("Error during Login:", error.message);
            alert(error.message); // Show error message to the user
        }
    };


  return (
    <>
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-gray-50 mt-20 border border-gray-200">

            {/* Header Title */}
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome to SecureCart</h2>
            <p className="text-center text-gray-600 mb-2">Log in to access your account as a seller</p>
            <p className="text-center text-gray-600 mb-6">Are you Customer? <a href='/customerLog' className='font-bold hover:underline hover:text-blue-600'>login</a> here</p>

            {/* Render the appropriate form based on the active tab */}
            <div className="p-6 border-t-2 border-gray-200 bg-white rounded-b-lg">
                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        name="Email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    />
                    {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="Password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                        />
                        
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password}</p>}
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-600">
                            {/* <input type="checkbox" className="mr-2" /> Remember me */}
                        </label>
                        <a href="#" onClick={() => {alert('contact to customer care')}} className="text-sm text-blue-500 hover:underline">Forgot password?</a>
                    </div>
                    <input
                        type="submit"
                        value="Login"
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 ease-in-out focus:outline-none"
                    />
                </form>

                {/* Divider with Or */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* New User Call to Action */}
                <div className="text-center mt-4">
                    <p className="text-gray-600">Don't have an account?</p>
                    <a href="/sellerReg" className="text-blue-500 font-semibold hover:underline">Sign up now</a>
                </div>

                {/* Quick Links */}
                <div className="text-center mt-4 text-sm text-gray-600">
                    <p><a href="/#" className="hover:underline">Privacy Policy</a> | <a href="/#" className="hover:underline">Terms & Conditions</a></p>
                </div>
            </div>
        </div>
    </>
  )
}
