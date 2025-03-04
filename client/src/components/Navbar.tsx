import { Link } from "@tanstack/react-router";

const Navbar = () => {
    return (
        <div className="appear px-4 flex flex-col md:flex-row justify-between items-center w-full md:gap-2 text-2xl text-gray-300">
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
            <div className="w-full md:w-auto flex flex-wrap justify-around md:justify-normal gap-8 sm:gap-4 font-extralight py-4">
                <Link
                    to="/login"
                    className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out"
                >
                    Logowanie
                </Link>
                <Link
                    to="/registration"
                    className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out"
                >
                    Rejestracja
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
