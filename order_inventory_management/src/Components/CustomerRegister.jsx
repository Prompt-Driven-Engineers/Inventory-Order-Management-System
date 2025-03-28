export default function CustomerRegister() {
    return(
        <>
            <div className="min-h-screen p-20 bg-gray-300">
                <div className="w-xl mx-auto mt- flex p-6  bg-amber-300">
                    <div className="div">
                        <h2>Welcome to Invntory Management</h2>
                        <p>Alredy have an account?</p>
                    </div>
                    <div className="p-3 bg-amber-50 w-full rounded-lg">
                        <h2 className="font-bold text-2xl text-center mb-5">Customer Registration</h2>
                       <form action="">
                        <div className="flex flex-col mb-3 ">
                            <label 
                            htmlFor="" className="ml-1">Full Name</label>
                            <input 
                                type="text"
                                name="Name"
                                placeholder="Enter your full name"
                                className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                            />
                        </div>

                        <div className="flex flex-col mb-3">
                        <label htmlFor="">Phone No</label>
                            <input 
                                type="text"
                                name="phone"
                                placeholder="Enter your phone number"
                                className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                            
                            />
                        </div>

                        <div className="flex flex-col mb-3">
                        <label htmlFor="">Email ID</label>
                            <input 
                                type="email"
                                name="Email"
                                placeholder="Enter your email id"
                                className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                                
                            />
                        </div>

                        <div className="div">
                            <h2 className="text-2xl  mt-4 mb-2">Address informaion</h2>
                            <div className="div">
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="">City</label>
                                    <input 
                                        type="text"
                                        name="City"
                                        placeholder="Enter your city"
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                                        
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="">Country</label>
                                    <select 
                                    className="w-full border text-gray-500 border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                                        
                                        
                                    >
                                        <option value="">Select Country</option>
                                    </select>
                                  
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="">State</label>
                                    <select 
                                    className="w-full border text-gray-400 border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                                        
                                        
                                    >
                                        <option value="">Select State</option>
                                    </select>
                                  
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="">Zip code</label>
                                    <input 
                                        type="number"
                                        name="City"
                                        placeholder="Enter your zip code"
                                        className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 "
                                        
                                    />
                                </div>
                            </div>
                        </div>



                       </form>
                    </div>
                </div>
            </div>
        </>
    )
}