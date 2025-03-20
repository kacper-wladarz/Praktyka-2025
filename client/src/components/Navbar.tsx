import { Link } from "@tanstack/react-router";
import UserOperations from "./UserOperations";
import Profile from "./Profile";
import { useAuth } from "@contexts/AuthContext";
import LngSelection from "./LngSelection";

const Navbar = () => {
    const auth = useAuth();

    return (
        <div className="appear header flex items-center gap-2 flex-wrap px-4 justify-between w-full md:gap-8 text-2xl text-gray-300 z-40">
            <div className="flex-1 flex flex-col md:flex-row items-stretch">
                <Link
                    to="/"
                    className="w-full sm:w-auto flex items-center gap-4"
                >
                    <img
                        className="w-20 sm:w-28 transition-[width] duration-500 ease-in-out"
                        src="/logo-no-bg.png"
                        alt=""
                    />
                    <span className="text-4xl sm:text-6xl whitespace-nowrap transition-[font-size] duration-500 ease-in-out">
                        Chat AI
                    </span>
                </Link>
                {!auth.isAuthenticated && <UserOperations />}
            </div>
            {!auth.isAuthenticated && (
                <div className="w-[1px] h-1/4 bg-white opacity-50"></div>
            )}
            <LngSelection />
            {auth.isAuthenticated && <Profile />}
        </div>
    );
};

export default Navbar;
