import { Link } from "@tanstack/react-router";
import UserOperations from "./UserOperations";
import Profile from "./Profile";
import { useContext } from "react";
import { GlobalContext } from "../App";

const Navbar = () => {
    const { JWT } = useContext(GlobalContext);

    return (
        <div className="appear px-4 flex flex-col md:flex-row items-stretch justify-between w-full md:gap-2 text-2xl text-gray-300">
            <Link to="/" className="w-full md:w-auto flex items-center gap-4">
                <img
                    className="w-24 sm:w-32 transition-[width] duration-500 ease-in-out"
                    src="/logo-no-bg.png"
                    alt=""
                />
                <span className="text-4xl sm:text-6xl whitespace-nowrap transition-[font-size] duration-500 ease-in-out">
                    Chat AI
                </span>
            </Link>
            {JWT ? <Profile /> : <UserOperations />}
        </div>
    );
};

export default Navbar;
