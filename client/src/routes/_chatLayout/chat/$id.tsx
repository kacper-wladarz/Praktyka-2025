import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { updateChat } from "../../../api/mutations/lastOpenedChat";
import { useEffect } from "react";
import Chat from "../../../components/chat/Chat";
import { getChatPath } from "../../../api/queries/getChatPath";

export const Route = createFileRoute("/_chatLayout/chat/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { id } = Route.useParams();
    const { data: chatPath } = getChatPath(id);
    const update = updateChat();

    useEffect(() => {
        if (!id) navigate({ to: "/chat" });
    }, [id]);

    const handleClose = () => {
        update.mutate(null, {
            onSuccess: () => {
                navigate({ to: "/chat" });
            },
        });
    };

    return (
        <div className="appear flex-1 flex flex-col bg-zinc-900">
            <div className="chat_header w-full flex items-center justify-between text-extralight px-8 py-2 shadow-[0px_0px_8px_0px_rgb(0,0,0)]">
                <span className="text-sm">
                    {chatPath && chatPath.join(" ⭢ ")}
                </span>
                <button
                    className="text-xl cursor-pointer hover:bg-zinc-800 px-4 py-2 rounded-xl transition-[background] duration-300 ease-in-out"
                    onClick={() => handleClose()}
                >
                    Zamknij
                </button>
            </div>
            <Chat chatId={id} />
        </div>
    );
}
