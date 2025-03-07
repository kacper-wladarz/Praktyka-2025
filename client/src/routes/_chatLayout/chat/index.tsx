import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { GlobalContext } from "../../../App";

export const Route = createFileRoute("/_chatLayout/chat/")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { JWT } = useContext(GlobalContext);

    if (!JWT) {
        navigate({ to: "/" });
    }

    return (
        <div className="appear flex-1 flex">
            <div className="flex-1 flex justify-center px-4 py-16 bg-zinc-900">
                <span className="text-3xl text-center tracking-wide font-extralight">
                    Wybierz czat, który chcesz otworzyć
                </span>
            </div>
        </div>
    );
}
