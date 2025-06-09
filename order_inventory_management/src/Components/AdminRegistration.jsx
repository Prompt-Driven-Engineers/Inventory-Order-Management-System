import React, {useState} from 'react';
import { countries } from '../Data/Country_States';
import { Roles } from '../Data/Roles'; // Import the roles array

export default function AdminRegistration() {
    const [form, setForm] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Phone2: '',  
        PANID: '',
        ADHARID: '',
        Address: {
            Landmark: '',
            Street: '',
            City: '',
            State: '',
            Country: '',
            ZIP: '',
            AddressType: ''
        },
        Role: ''
    });

    const [errors, setErrors] = useState({});

    const states = countries.find((c) => c.name === form.Address.Country)?.states || [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validateForm = () => {
        console.log('Inside validation');
        let newErrors = {};
    
        if (!form.Name.trim()) {
            newErrors.Name = "Full Name is required";
        } else if (!/^[A-Za-z\s'-]+$/.test(form.Name)) {
            newErrors.Name = "Name can only contain letters, spaces, hyphens, or apostrophes";
        }

        if (!form.Email.trim()) {
            newErrors.Email = "Email is required";
        } else if (!emailRegex.test(form.Email) || form.Email.includes('..') || form.Email.endsWith('.')) {
            newErrors.Email = "Enter a valid email";
        }
        if (!form.Phone.trim()) {
            newErrors.Phone = "Phone Number is required";
        } else if (!/^[6-9]\d{9}$/.test(form.Phone) || /^(\d)\1{9}$/.test(form.Phone)) {
            newErrors.Phone = "Enter a valid 10-digit phone number";
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.PANID)) newErrors.PANID = "Enter Valid PANID";
        if (!form.PANID.trim()) newErrors.PANID = "PANID number is required";

        if (!form.ADHARID.trim()) {
            newErrors.ADHARID = "ADHARID number is required";
        } else if (!/^[0-9]{12}$/.test(form.ADHARID)) {
            newErrors.ADHARID = "Enter a valid 12-digit ADHARID";
        }
        
    
        // Address validation
        if (!form.Address.City.trim()) newErrors.City = "City is required";
        if (!form.Address.State.trim()) newErrors.State = "State is required";
        if (!form.Address.Country.trim()) newErrors.Country = "Country is required";
        if (!form.Address.ZIP.trim()) {
            newErrors.ZIP = "ZIP code is required";
        } else if (!/^[1-9][0-9]{5}$/.test(form.Address.ZIP) || /^(\d)\1{5}$/.test(form.Address.ZIP)) {
            newErrors.ZIP = "Enter a valid 6-digit Indian ZIP code";
        }
        if (!form.Address.AddressType.trim()) newErrors.AddressType = "Address Type is required";
    
        if (!form.Role.trim()) newErrors.Role = "Role is required";

        setErrors(newErrors);
        console.log(errors);
    
        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value.trim()
        })
    }

    const handleChangeAddress = (e) => {
        setForm({
            ...form,
            Address: {
                ...form.Address,
                [e.target.name] : e.target.value.trim()
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);
        if (!validateForm()) return; // Stop if validation fails
    
        try {
            const response = await fetch('http://localhost:8000/admins/adminReg', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
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
                                <h1 className="text-3xl font-bold mb-2">Introduce an Admin</h1>
                                {/* <p className="text-base mb-4">Join our platform and start selling your products today!</p>
                                <p>Already have an account? <a href="/login" className="underline text-blue-600 hover:text-blue-800">Log in here</a></p> */}
                            </div>

                            {/* Registration Form */}
                            <div className="w-full md:w-5/6 max-w-3xl bg-white shadow-lg rounded-lg p-8">
                                <form name='adminRegForm' onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
                                            type="email" 
                                            name='Email' 
                                            placeholder='Enter your email' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">PAN ID</label>
                                        <input 
                                            type="text" 
                                            name='PANID' 
                                            placeholder='Enter your PAN ID' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.PANID && <p className="text-red-500 text-sm mt-1">{errors.PANID}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ADHAR ID</label>
                                        <input 
                                            type="text" 
                                            name='ADHARID' 
                                            placeholder='Enter your ADHAR ID' 
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.ADHARID && <p className="text-red-500 text-sm mt-1">{errors.ADHARID}</p>}
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
                                            name='Country'
                                            value={form.Address.Country}
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
                                            name='State'
                                            // value={form.Address.State}
                                            onChange={handleChangeAddress}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!form.Address.Country} // ✅ Disable state selection if no country is selected
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            name='Role'  
                                            onChange={handleChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Role</option>
                                            {Roles.map((role, index) => (
                                                <option key={index} value={role.RoleName}>{role.RoleName}</option>
                                            ))}
                                        </select>
                                        {errors.Role && <p className="text-red-500 text-sm mt-1">{errors.Role}</p>}
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
