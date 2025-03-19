const Logged = () => {
    return (
        <div className="appear flex-1 flex flex-col justify-center items-center gap-6 text-xl">
            <span className="text-center">Jesteś zalogowany</span>
            <a
                href="/chat"
                className="text-center cursor pointer text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
            >
                Przejdź do czatu
            </a>
        </div>
    );
};

export default Logged;
