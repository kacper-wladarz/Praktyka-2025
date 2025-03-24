import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/dashboard/ai")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_dashboardLayout/dashboard/ai"!</div>;
}
