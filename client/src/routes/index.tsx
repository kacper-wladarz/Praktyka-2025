import { createFileRoute, Link } from "@tanstack/react-router";
import Loading from "../assets/Loading";
import { useContext } from "react";
import { GlobalContext } from "../App";

export const Route = createFileRoute("/")({
    component: Index,
    pendingComponent: () => <Loading />,
});

function Index() {
    const { JWT } = useContext(GlobalContext);

    return (
        <div className="appear flex-1 w-full flex flex-col items-center gap-12 py-16">
            <span className="text-6xl font-light">Witaj na czacie AI</span>
            {JWT ? (
                <Link
                    to="/chat"
                    className="text-xl font-extralight text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
                >
                    Przejdź do rozmowy
                </Link>
            ) : (
                <Link
                    to="/login"
                    className="text-xl font-extralight text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
                >
                    Stwórz konto lub zaloguj się, aby móc korzystać z czatu
                </Link>
            )}
        </div>
    );
}
