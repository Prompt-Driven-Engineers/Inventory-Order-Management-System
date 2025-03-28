export default function CustomerLogin() {
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
