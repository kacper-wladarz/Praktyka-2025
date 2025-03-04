import { createFileRoute, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/registration/error")({
    component: RouteComponent,
});

function RouteComponent() {
    const {
        location: { state },
    } = useRouterState();

    return <div>{state.message}</div>;
}
