import { createFileRoute } from "@tanstack/react-router";
import Loading from "../components/Loading";

export const Route = createFileRoute("/")({
    component: Index,
    pendingComponent: () => <Loading />,
});

function Index() {
    return (
        <div className="appear flex-1 w-full flex flex-col items-center gap-12 py-16">
            <span className="text-6xl font-light">Witaj na czacie AI</span>
            <span className="text-xl font-extralight">
                Stwórz konto lub zaloguj się, aby móc korzystać z czatu
            </span>
        </div>
    );
}
