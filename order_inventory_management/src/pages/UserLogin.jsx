import React, { useState, useRef, useEffect, useContext } from 'react';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import RoleSelector from '../Components/SlideHeader';
import { UserContext } from '../Context/UserContext';

export default function UserLogin() {
    // State to track which tab is active (default is 'customer')
    const [activeTab, setActiveTab] = useState('customer');
    const [errors, setErrors] = useState({});
    const location = useLocation();
    const from = `${location.state?.from?.pathname || ''}${location.state?.from?.search || ''}` || null;
    const redirectState = location.state?.from?.state || {};
    const { setIsLoggedIn } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [form, setForm] = useState({
        Email: '',
        Password: ''
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateForm = () => {
        let newErrors = {};

        if (!form.Email.trim()) {
            newErrors.Email = "Email is required";
        } else if (!emailRegex.test(form.Email) || form.Email.includes('..') || form.Email.endsWith('.')) {
            newErrors.Email = "Enter a valid email";
        }

        // Password validation
        if (form.Password.length < 6) newErrors.Password = "Password must be at least 6 characters";
        if (!form.Password.trim()) newErrors.Password = "Password is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value.trim()
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop if validation fails
        if (activeTab === 'customer') {
            try {
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
                    toast.error(result.error || 'Something went wrong');
                } else {
                    setIsLoggedIn(true);
                    if(from) navigate(from, { replace: true, state: redirectState });
                    else navigate(`/customerDash`, { replace: true });
                    toast.success("Login successful!");
                }

            } catch (error) {
                console.error("Error during Login:", error.message);
                alert(error.message); // Show error message to the user
            }
        } else if (activeTab === 'seller') {
            try {
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
                    toast.error(result.error || 'Something went wrong')
                } else {
                    setIsLoggedIn(true);
                    if(from) navigate(from, { replace: true, state: redirectState });
                    else navigate(`/sellerDash`, { replace: true });
                    toast.success("Login successful!");
                }

            } catch (error) {
                console.error("Error during Login:", error.message);
                toast.error(error.message); // Show error message to the user
            }
        }
    };

    const [adminLoginForm, setAdminLoginForm] = useState({
        AdminId: '',
        Password: ''
    });

    const validateAdminForm = () => {
        console.log('Inside admin validation');
        let newErrors = {};

        if (!/^[ADM]{3}[0-9]{2}[A-Z]{2}[0-9]{2}[A-Z]{2}$/.test(adminLoginForm.AdminId)) newErrors.AdminId = "Enter Valid AdminId";
        if (!adminLoginForm.AdminId.trim()) newErrors.AdminId = "AdminId is required";


        // Password validation
        if (adminLoginForm.Password.length < 6) newErrors.Password = "Password must be at least 6 characters";
        if (!adminLoginForm.Password.trim()) newErrors.Password = "Password is required";

        setErrors(newErrors);
        console.log(errors);

        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };


    const handleAdminFormChange = (e) => {
        setAdminLoginForm({
            ...adminLoginForm,
            [e.target.name]: e.target.value.trim()
        });
    }

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!validateAdminForm()) return; // Stop if validation fails
        console.log("logging in Admin");
        console.log(adminLoginForm);
        try {
            const response = await fetch('http://localhost:8000/admins/adminLogin', {
                method: 'POST',
                body: JSON.stringify(adminLoginForm),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok) {
                console.log(result.error || 'Something went wrong');
                toast.error(result.error || 'Something went wrong')
            } else {
                setIsLoggedIn(true);
                if(from) navigate(from, { replace: true, state: redirectState });
                else navigate(`/adminDash`, { replace: true });
                toast.success("Login successful!");
            }

        } catch (error) {
            console.error("Error during Login:", error.message);
            toast.error(error.message); // Show error message to the user
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-gray-50 mt-10 border border-gray-200">

            {/* Header Title */}
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome to SecureCart</h2>
            <p className="text-center text-gray-600 mb-6">Log in to access your account</p>

            {/* Tab Headers */}
            <RoleSelector activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Render the appropriate form based on the active tab */}
            <div className="p-6 border-t-2 border-gray-200 bg-white rounded-b-lg">
                {activeTab !== 'admin' ? <form>
                    <input
                        type="text"
                        name="Email"
                        value={form.Email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    />
                    {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
                    <div className="relative mt-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="Password"
                            value={form.Password}
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
                        <a href="#" onClick={() => { alert('contact to customer care') }} className="text-sm text-blue-500 hover:underline">Forgot password?</a>
                    </div>
                    <input
                        type='submit'
                        onClick={handleLogin}
                        value="Login"
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 ease-in-out focus:outline-none"
                    />
                </form>
                    : <form>
                        <input
                            type="text"
                            onChange={handleAdminFormChange}
                            name="AdminId"
                            value={adminLoginForm.AdminId}
                            placeholder="Enter your AdminID"
                            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                        />
                        {errors.AdminId && <p className="text-red-500 text-sm mt-1">{errors.AdminId}</p>}
                        <div className="relative mt-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="Password"
                                value={adminLoginForm.Password}
                                placeholder="Enter your password"
                                onChange={handleAdminFormChange}
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
                            <a href="#" onClick={() => { alert('contact to customer care') }} className="text-sm text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <input
                            type='submit'
                            onClick={handleAdminLogin}
                            value="Login"
                            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 ease-in-out focus:outline-none"
                        />
                    </form>
                }

                {/* Divider with Or */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* New User Call to Action */}
                <div className="text-center mt-4">
                    <p className="text-gray-600">Don't have an account?</p>
                    <a onClick={() => navigate('/customerReg')} className="text-blue-500 font-semibold hover:underline">Sign up now as user</a>
                </div>
            </div>
        </div>
    );
}
