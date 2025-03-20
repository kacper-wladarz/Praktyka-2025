import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Loading from "@assets/Loading";
import SidebarArrow from "@assets/SidebarArrow";
import { useGlobalContext } from "@contexts/GlobalContext";
import { useSidebarContext } from "@contexts/SidebarContext";
import { useLastOpenedChat } from "@queries/getLastOpenedChat";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_chatLayout/chat/")({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): ChatQueryFilter => {
        return {
            structureId: search.structureId as string,
            name: search.name as string,
            type: search.type as "CHAT" | "FOLDER",
        };
    },
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { data, isPending } = useLastOpenedChat();
    const structureData = Route.useSearch();
    const { setStructureToDelete } = useGlobalContext();
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext();
    const { t } = useTranslation();

    useEffect(() => {
        if (structureData && structureData.structureId) {
            setStructureToDelete({
                id: structureData.structureId,
                name: structureData.name,
                type: structureData.type,
            });
        }
    }, [structureData]);

    useEffect(() => {
        if (data && data.lastOpenedChat) {
            navigate({ to: "/chat/$id", params: { id: data.lastOpenedChat } });
        }
    }, [data]);

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex-1 flex flex-col">
            <div className={`chat_header flex items-center py-2`}>
                <button
                    className="cursor-pointer sidebar_button"
                    onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
                >
                    <SidebarArrow isOpen={isSidebarOpen} />
                </button>
            </div>
            <div className="flex-1 flex justify-center px-4 py-16 bg-zinc-900">
                <span className="text-3xl text-center tracking-wide font-extralight">
                    {t("chat.selectChat")}
                </span>
            </div>
        </div>
    );
}
