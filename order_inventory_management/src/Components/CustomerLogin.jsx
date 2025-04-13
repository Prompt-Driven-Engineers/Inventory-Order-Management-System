import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";

export default function CustomerLogin() {
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
            [e.target.name] : e.target.value
        });
    }

    const handleLogin = async(e) => {
        e.preventDefault();
        console.log(form);
        if (!validateForm()) return; // Stop if validation fails
        console.log("logging in customer");

        try{
            const response = await fetch('http://localhost:8000/customers/customerLogin', {
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
                navigate(`/customerDash`);
                alert("Login successful!"); // Show success message to the user
            }

        } catch(error) {
            console.error("Error during Login:", error.message);
            alert(error.message); // Show error message to the user
        }
    };

    return(
        <>
        
        <div className="max-w-xl mt-30 flex items-center rounded-l-4xl shadow-2xl mx-auto mt-10 p-3 bg-amber-300">
            <div className="p-4 bg-black rounded-l-full ">
                <h1 className="text-white text-2xl " >Welcome to Inventory Managament System</h1>
            </div>
            <div className="p-4 rounded-lg border-gray-200  bg-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Coustomer login</h2>
                <p className="text-center text-gray-600 mb-10">Log in to access your account</p>
                <div className="div">
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

                    {/* or divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    {/* new user */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Don't have an account?</p>
                        <a href="/customerReg" className="text-blue-500 font-semibold hover:underline">Sign up now</a>
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-600">
                        <p><a href="/#" className="hover:underline">Privacy Policy</a> | <a href="/#" className="hover:underline">Terms & Conditions</a></p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
