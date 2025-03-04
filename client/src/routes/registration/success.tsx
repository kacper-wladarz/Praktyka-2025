import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/registration/success")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <span>Pomyślnie stworzono konto</span>
            <Link to="/">Przejdź na stronę główną</Link>
        </div>
    );
}
