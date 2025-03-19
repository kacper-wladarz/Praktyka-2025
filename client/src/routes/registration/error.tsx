import {
    createFileRoute,
    redirect,
    useRouterState,
} from "@tanstack/react-router";
import Loading from "@assets/Loading";

export const Route = createFileRoute("/registration/error")({
    loader: ({ location }) => {
        if (!location.state?.message) {
            return redirect({ to: location.state?.from || "/" });
        }
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const {
        location: { state },
    } = useRouterState();

    return (
        <div className="appear flex-1 flex flex-col justify-center items-center text-xl">
            <span className="text-center">{state.message}</span>
        </div>
    );
}
