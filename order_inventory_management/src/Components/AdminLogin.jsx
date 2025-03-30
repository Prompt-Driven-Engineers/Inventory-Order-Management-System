export default function AdminLogin() {
    return(
        <>
            <div className="min-h-screen p-6 bg-gray-300">
            <div className="max-w-2xl  flex items-center rounded-l-4xl shadow-2xl mx-auto mt-10 p-3 bg-blue-300">
            <div className="p-4 bg-black rounded-l-3xl flex flex-col items-center ">
                <h1 className="text-white text-2xl ml-9 " >Welcome to Inventory Managament System</h1>
                <img src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?t=st=1743246399~exp=1743249999~hmac=cd93f6c25cca4a6e192cdf56132004043a631685f7236c669dae309ef35ed4a0&w=826" alt="" className=" w-32 h-24 rounded-full"/>
            </div>
            <div className="p-4 rounded-lg border-gray-200  bg-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin login</h2>
                <p className="text-center text-gray-600 mb-10">Log in to access your account</p>
                <div className="div">
                    <form className="space-y-6">
                        <input 
                        type="text" 
                        name="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <input 
                        type="password" 
                        name="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                    
                        />

                        <button
                            type="button"
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