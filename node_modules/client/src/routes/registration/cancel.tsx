import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Loading from "../../assets/Loading";

export const Route = createFileRoute("/registration/cancel")({
    loader: ({ location }) => {
        if (!location.state?.allow) {
            return redirect({ to: location.state?.from || "/" });
        }
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    return (
        <div className="appear flex-1 flex flex-col justify-center items-center text-xl">
            <Link
                to="/registration"
                className="text-center cursor pointer text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
            >
                Przejdź z powrotem do rejestracji
            </Link>
        </div>
    );
}
