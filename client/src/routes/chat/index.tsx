import { createFileRoute } from "@tanstack/react-router";
import Folders from "../../components/chat/Folders";

export const Route = createFileRoute("/chat/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full flex-1 flex">
            <Folders />
        </div>
    );
}
