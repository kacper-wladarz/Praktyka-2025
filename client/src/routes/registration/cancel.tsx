import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/registration/cancel")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <Link to="/registration">Przejdź z powrotem do rejestracji</Link>
        </div>
    );
}
