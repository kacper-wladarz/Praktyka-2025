const FolderArrow = ({
    isOpen,
    isVisible = true,
}: {
    isOpen: boolean;
    isVisible?: boolean;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={`${isOpen ? "-rotate-90" : "rotate-0"} transition-transform duration-300 ease-in-out ${isVisible ? "" : "opacity-0"}`}
        >
            <path
                fill="#fff"
                d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z"
            />
        </svg>
    );
};

export default FolderArrow;
