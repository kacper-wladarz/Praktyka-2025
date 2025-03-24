import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/dashboard/stats")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_dashboardLayout/dashboard/stats"!</div>;
}
