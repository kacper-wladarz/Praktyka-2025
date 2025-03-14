import { Link } from "@tanstack/react-router";
import UserOperations from "./UserOperations";
import Profile from "./Profile";
import { useContext } from "react";
import { GlobalContext } from "../App";

const Navbar = () => {
    const { JWT } = useContext(GlobalContext);

    return (
        <div className="appear header flex gap-2 flex-wrap px-4 justify-between w-full md:gap-2 text-2xl text-gray-300 z-[1000]">
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
                {!JWT && <UserOperations />}
            </div>
            {JWT && <Profile />}
        </div>
    );
};

export default Navbar;
