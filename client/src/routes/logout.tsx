import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <span>Wylogowano</span>
            <Link to="/">Wróc do strony głównej</Link>
        </div>
    );
}
