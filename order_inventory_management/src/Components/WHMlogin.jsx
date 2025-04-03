export default function WHMlogin() {
    return(
        <>
            <div className="min-h-screen p-6 bg-gray-300">
            <div className="max-w-2xl  flex items-center rounded-l-4xl shadow-2xl mx-auto mt-10 p-3 bg-blue-300">
            <div className="p-4 bg-black rounded-l-3xl flex flex-col items-center ">
                <h1 className="text-white text-2xl ml-9 " >Welcome to Inventory Managament System</h1>
                <img src="https://img.freepik.com/free-vector/hand-drawn-international-trade-with-delivery-man_23-2149161321.jpg?t=st=1743655325~exp=1743658925~hmac=6dcc169af63c062262d07ea73badf5db5dd304d1fae4cf917983ea20a5c4c502&w=826" alt="" className=" w-32 h-32 rounded-full"/>
            </div>
            <div className="p-4 rounded-lg border-gray-200  bg-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Ware House Manager Login</h2>
                <p className="text-center text-gray-600 mb-10">Log in to access your account</p>
                <div className="div">
                    <form className="space-y-6">
                        <input 
                            type="text" 
                            name="ManagerID"
                            placeholder="Enter your ManagerID"
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <input 
                        type="Password" 
                        name="Password"
                        placeholder="Enter your Password"
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
                        <a href="/customerReg" className="text-gray-500 font-semibold hover:underline">Contact Admin!</a>
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