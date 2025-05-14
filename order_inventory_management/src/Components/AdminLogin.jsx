import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [adminLoginForm, setAdminLoginForm] = useState({
        AdminId: '',
        Password: ''
    });

    const validateAdminForm = () => {
        console.log('Inside validation');
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
            [e.target.name] : e.target.value
        });
    }

    const handleAdminLogin = async(e) => {
        e.preventDefault();
        console.log(adminLoginForm);
        if (!validateAdminForm()) return; // Stop if validation fails
        console.log("logging in Admin");

        try{
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
                alert(result.error || 'Something went wrong')
            } else {
                console.log("Login successful:", result);
                navigate(`/adminDash`);
                alert("Login successful!"); // Show success message to the user
            }

        } catch(error) {
            console.error("Error during Login:", error.message);
            alert(error.message); // Show error message to the user
        }
    };


    return(
        <>
            <div className="min-h-screen p-6 bg-gray-300">
            <div className="max-w-2xl  flex items-center rounded-l-4xl shadow-2xl mx-auto mt-10 p-3 bg-blue-300">
            <div className="p-4 bg-black rounded-l-3xl flex flex-col items-center ">
                <h1 className="text-white text-2xl ml-9 " >Welcome to Inventory Managament System</h1>
                <img src="https://img.freepik.com/free-vector/forgot-Password-concept-illustration_114360-1123.jpg?t=st=1743246399~exp=1743249999~hmac=cd93f6c25cca4a6e192cdf56132004043a631685f7236c669dae309ef35ed4a0&w=826" alt="" className=" w-32 h-24 rounded-full"/>
            </div>
            <div className="p-4 rounded-lg border-gray-200  bg-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin login</h2>
                <p className="text-center text-gray-600 mb-10">Log in to access your account</p>
                <div className="div">
                    <form className="space-y-6">
                        <input 
                            type="text" 
                            onChange={handleAdminFormChange}
                            name="AdminId"
                            placeholder="Enter your AdminID"
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <input 
                        type="Password" 
                        name="Password"
                        onChange={handleAdminFormChange}
                        placeholder="Enter your Password"
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                    
                        />

                        <button
                            type="button"
                            onClick={handleAdminLogin}
                            className="bg-black text-white w-full rounded-lg py-2 px-4 hover:bg-amber-300 hover:text-black hover:border-black border-1"
                            >
                                Login
                        </button>
                    </form>

                    {/* or divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    {/* new user */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Having any issue?</p>
                        <a href="/customerReg" className="text-gray-500 font-semibold hover:underline">Contact technical support!</a>
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-600">
                        <p><a href="/#" className="hover:underline">Privacy Policy</a> | <a href="/#" className="hover:underline">Terms & Conditions</a></p>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </>
    )
}