import { Link } from "@tanstack/react-router";

const UserOperations = () => {
    return (
        <div className="flex flex-wrap justify-around md:justify-normal items-center gap-8 sm:gap-4 font-extralight py-4">
            <Link
                to="/login"
                className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out h-fit"
            >
                Logowanie
            </Link>
            <Link
                to="/registration"
                className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out h-fit"
            >
                Rejestracja
            </Link>
        </div>
    );
};

export default UserOperations;
