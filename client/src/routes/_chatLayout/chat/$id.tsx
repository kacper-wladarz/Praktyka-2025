import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Chat from "@components/chat/Chat";
import Loading from "@assets/Loading";
import SidebarArrow from "@assets/SidebarArrow";
import { useGlobalContext } from "@contexts/GlobalContext";
import { useSidebarContext } from "@contexts/SidebarContext";
import { useChatPath } from "@queries/getChatPath";
import { useUpdateChat } from "@mutations/lastOpenedChat";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_chatLayout/chat/$id")({
    validateSearch: (search: Record<string, unknown>): ChatQueryFilter => {
        return {
            structureId: search.structureId as string,
            name: search.name as string,
            type: search.type as "CHAT" | "FOLDER",
        };
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { id } = Route.useParams();
    const { data: chatPath, error } = useChatPath(id);
    const setLastOpenedChat = useUpdateChat();
    const { setStructureToDelete } = useGlobalContext();
    const structureData = Route.useSearch();
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext();
    const { t } = useTranslation();

    useEffect(() => {
        if (error || !id) navigate({ to: "/chat" });
    }, [error, id]);

    useEffect(() => {
        if (structureData && structureData.structureId) {
            setStructureToDelete({
                id: structureData.structureId,
                name: structureData.name,
                type: structureData.type,
            });
        }
    }, [structureData]);

    const handleClose = () => {
        setLastOpenedChat.mutate(null, {
            onSuccess: () => {
                setIsSidebarOpen(false);
                navigate({ to: "/chat" });
            },
        });
    };

    return (
        <div className="appear w-full max-w-full flex flex-col bg-zinc-900">
            <div className="chat_header w-full flex gap-4 items-center text-extralight p-2 shadow-[0px_0px_8px_0px_rgb(0,0,0)]">
                <button
                    className="cursor-pointer sidebar_button"
                    onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
                >
                    <SidebarArrow isOpen={isSidebarOpen} />
                </button>
                <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm">
                        {chatPath && chatPath.join(" ⭢ ")}
                    </span>
                    <button
                        className="text-xl cursor-pointer hover:bg-zinc-800 px-4 py-2 rounded-xl transition-[background] duration-300 ease-in-out"
                        onClick={() => handleClose()}
                    >
                        {t("chat.closeButton")}
                    </button>
                </div>
            </div>
            <Chat chatId={id} />
        </div>
    );
}
