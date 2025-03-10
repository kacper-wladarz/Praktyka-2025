import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLastOpenedChat } from "../../../api/queries/getLastOpenedChat";
import Loading from "../../../assets/Loading";

export const Route = createFileRoute("/_chatLayout/chat/")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { data, isPending } = getLastOpenedChat();

    useEffect(() => {
        if (data && data.lastOpenedChat) {
            navigate({ to: "/chat/$id", params: { id: data.lastOpenedChat } });
        }
    }, [data]);

    if (isPending) {
        return <Loading />;
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
