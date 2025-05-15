import { LogOut } from "lucide-react";
import { handleLogout } from '../apiCall/customer';

export default function LeftSidebar({children, setIsLoggedIn, setUser, navigate, isLoggedIn}) {
    return (
        <div className="fixed hidden sm:block w-1/4 min-h-[calc(100dvh-64px)] bg-white p-6 shadow-md flex flex-col justify-between">
            {children}
            {/* Logout Button */}
            {isLoggedIn && (
                <div
                    onClick={() => {
                        handleLogout(setIsLoggedIn, setUser, navigate);
                    }}
                    className="absolute bottom-6 left-6 right-6 flex items-center bg-red-100 text-red-600 px-3 py-2 font-semibold rounded-md cursor-pointer hover:bg-red-200 transition-all duration-300"
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                </div>
            )}
        </div>
    )
}
