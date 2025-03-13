import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Loading from "../assets/Loading";

export const Route = createFileRoute("/logout")({
    loader: ({ location }) => {
        if (!location.state?.allow) {
            return redirect({ to: "/" });
        }
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    return (
        <div className="appear flex-1 flex flex-col justify-center items-center gap-6 text-xl">
            <span className="text-center">Wylogowano</span>
            <Link
                to="/"
                className="text-center cursor-pointer text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
            >
                Wróc do strony głównej
            </Link>
        </div>
    );
}
