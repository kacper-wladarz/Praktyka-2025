const SidebarArrow = ({ isOpen }: { isOpen: boolean }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className={`pointer-events-none block lg:hidden transition-transform duration-300 ease-in-out ${isOpen ? "-rotate-180" : "-rotate-90"}`}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="m4 15l8-8l8 8l-2 2l-6-6l-6 6z"
            />
        </svg>
    );
};

export default SidebarArrow;
