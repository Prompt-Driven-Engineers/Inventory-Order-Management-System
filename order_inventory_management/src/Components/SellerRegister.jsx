import React, {useState} from 'react';
import { Eye, EyeOff } from "lucide-react";
import { countries } from '../Data/Country_States';

export default function SellerRegister() {

    const [form, setForm] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Phone2: '',    
        StoreName: '',
        StoreDesc: '',
        PAN: '',
        Address: {
            Landmark: '',
            Street: '',
            City: '',
            State: '',
            Country: '',
            ZIP: '',
            AddressType: ''
        },
        BankAccount: {
            AccountNo: '',
            IFSC: ''
        },
        PasswordHash: ''
    });

    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const states = countries.find((c) => c.name === selectedCountry)?.states || [];

    const validateForm = () => {
        console.log('Inside validation');
        let newErrors = {};
    
        if (!form.Name.trim()) newErrors.Name = "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(form.Email)) newErrors.Email = "Enter Valid Email";
        if (!form.Email.trim()) newErrors.Email = "Email is required";
        if (!/^[1-9]\d{9}$/.test(form.Phone)) newErrors.Phone = "Enter Valid 10-digit Phone Number";
        if (!form.Phone.trim()) newErrors.Phone = "Phone Number is required";
        if (!form.StoreName.trim()) newErrors.StoreName = "Store Name is required";
        if (!form.StoreDesc.trim()) newErrors.StoreDesc = "Store Description is required";
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.PAN)) newErrors.PAN = "Enter Valid PAN";
        if (!form.PAN.trim()) newErrors.PAN = "PAN number is required";
    
        // Address validation
        if (!form.Address.City.trim()) newErrors.City = "City is required";
        if (!form.Address.State.trim()) newErrors.State = "State is required";
        if (!form.Address.Country.trim()) newErrors.Country = "Country is required";
        if (!form.Address.ZIP.trim() || !/^\d{6}$/.test(form.Address.ZIP)) newErrors.ZIP = "Valid 6-digit ZIP code is required";
        if (!form.Address.AddressType.trim()) newErrors.AddressType = "Address Type is required";

        // Validate Account Number
        if (!form.BankAccount.AccountNo.trim()) {
            newErrors.AccountNo = "Account Number is required";
        } else if (!/^\d{9,18}$/.test(form.BankAccount.AccountNo)) {
            newErrors.AccountNo ||= "Enter a valid Account Number (9-18 digits)";
        }

        // Validate IFSC Code
        if (!form.BankAccount.IFSC.trim()) {
            newErrors.IFSC = "IFSC Code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.BankAccount.IFSC)) {
            newErrors.IFSC ||= "Enter a valid IFSC Code (e.g., HDFC0123456)";
        }

    
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
            [e.target.name] : e.target.value
        })
    }

    const handleChangeAddress = (e) => {
        setForm({
            ...form,
            Address: {
                ...form.Address,
                [e.target.name] : e.target.value
            }
        });
    }

    const handleChangeBankdetail = (e) => {
        setForm({
            ...form,
            BankAccount: {
                ...form.BankAccount,
                [e.target.name] : e.target.value
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return; // Stop if validation fails
    
        try {
            const response = await fetch('http://localhost:8000/sellers/sellerReg', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }
    
            console.log("Registration successful:", result);
            alert("Registration successful!"); // Show success message to the user
        } catch (error) {
            console.error("Error during registration:", error.message);
            alert(error.message); // Show error message to the user
        }
    };    

    return (
        <>
           <div className="min-h-screen bg-gray-100 p-6">
                {/* Merged Hero Banner with Form */}
                <div className="relative bg-blue-200 text-gray-800 rounded-lg shadow-md mb-8 p-8 max-w-screen-xl mx-auto w-4/5">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "url('https://source.unsplash.com/random/1600x900?seller')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            {/* Banner Content */}
                            <div className="mb-6 md:mb-0 md:w-1/4">
                                <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
                                <p className="text-base mb-4">Join our platform and start selling your products today!</p>
                                <p>Already have an account? <a href="/login" className="underline text-blue-600 hover:text-blue-800">Log in here</a></p>
                            </div>

                            {/* Registration Form */}
                            <div className="w-full md:w-5/6 max-w-3xl bg-white shadow-lg rounded-lg p-8">
                                <form name='userRegForm' onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* seller Information */}
                                    <div className="col-span-full">
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input 
                                            type="text" 
                                            name='Name' 
                                            placeholder='Enter your full name' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name='Phone' 
                                            placeholder='Enter your phone number' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Phone && <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email ID</label>
                                        <input 
                                            type="text" 
                                            name='Email' 
                                            placeholder='Enter your email' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                                        <input 
                                            type="text" 
                                            name='StoreName' 
                                            placeholder='Enter your store name' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.StoreName && <p className="text-red-500 text-sm mt-1">{errors.StoreName}</p>}
                                    </div>

                                    <div className="col-span-full lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Store Description</label>
                                        <input 
                                            type="text" 
                                            name='StoreDesc' 
                                            placeholder='Enter a brief description of your store' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.StoreDesc && <p className="text-red-500 text-sm mt-1">{errors.StoreDesc}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">PAN ID</label>
                                        <input 
                                            type="text" 
                                            name='PAN' 
                                            placeholder='Enter your PAN number' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.PAN && <p className="text-red-500 text-sm mt-1">{errors.PAN}</p>}
                                    </div>

                                    {/* Address Information */}
                                    <h3 className="text-lg font-semibold text-gray-700 col-span-full">Address Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Landmark</label>
                                        <input 
                                            type="text" 
                                            name='Landmark' 
                                            placeholder='Enter address label' 
                                            onChange={handleChangeAddress} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Landmark && <p className="text-red-500 text-sm mt-1">{errors.Landmark}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Street</label>
                                        <input 
                                            type="text" 
                                            name='Street' 
                                            placeholder='Enter street address' 
                                            onChange={handleChangeAddress} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Street && <p className="text-red-500 text-sm mt-1">{errors.Street}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input 
                                            type="text" 
                                            name='City' 
                                            placeholder='Enter city' 
                                            onChange={handleChangeAddress} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.City && <p className="text-red-500 text-sm mt-1">{errors.City}</p>}
                                    </div>

                                    <div>
                                        {/* Country Select */}
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <select
                                            name="Country"
                                            value={form.Address.Country || ""}
                                            onChange={handleChangeAddress}
                                            className="w-full p-3 border rounded-lg"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.name} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.Country && <p className="text-red-500 text-sm mt-1">{errors.Country}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mt-2">State</label>
                                        <select
                                            name="State"
                                            value={form.Address.State || ""}
                                            onChange={handleChangeAddress}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!form.Address.Country} // Disable state selection if no country is selected
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>

                                    {errors.State && <p className="text-red-500 text-sm mt-1">{errors.State}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <input 
                                            type="text" 
                                            name='ZIP' 
                                            placeholder='Enter zip code' 
                                            onChange={handleChangeAddress} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.ZIP && <p className="text-red-500 text-sm mt-1">{errors.ZIP}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address Type(e.g., Home, Office)</label>
                                        <input 
                                            type="text" 
                                            name='AddressType' 
                                            placeholder='Enter Address type(Home, Office)' 
                                            onChange={handleChangeAddress} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.AddressType && <p className="text-red-500 text-sm mt-1">{errors.AddressType}</p>}
                                    </div>

                                    {/* Bank Details */}
                                    <h3 className="text-lg font-semibold text-gray-700 col-span-full">Bank Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                        <input 
                                            type="text" 
                                            name='AccountNo' 
                                            placeholder='Enter your account number' 
                                            onChange={handleChangeBankdetail} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.AccountNo && <p className="text-red-500 text-sm mt-1">{errors.AccountNo}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                                        <input 
                                            type="text" 
                                            name='IFSC' 
                                            placeholder='Enter IFSC code' 
                                            onChange={handleChangeBankdetail} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.IFSC && <p className="text-red-500 text-sm mt-1">{errors.IFSC}</p>}
                                    </div>

                                    {/* Password Fields */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                name="PasswordHash"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create your password"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.PasswordHash && <p className="text-red-500 text-sm mt-1">{errors.PasswordHash}</p>}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative mt-4">
                                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>

                                    <div className="col-span-full">
                                        <button 
                                            type='submit' 
                                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300'
                                        >
                                            Register as Seller
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
        
    )
}

<>
</>