import { useContext } from "react";
import { GlobalContext, router } from "../../App";
import { deleteFolder } from "../../api/mutations/deleteFolder";
import { useQueryClient } from "@tanstack/react-query";
import { deleteChat } from "../../api/mutations/deleteChat";

const DeleteWindow = () => {
    const deleteFolderMutation = deleteFolder();
    const deleteChatMutation = deleteChat();
    const queryClient = useQueryClient();
    const { setIsConfirmWindowOpen, structureToDelete, chatId } =
        useContext(GlobalContext);

    const cancelDelete = () => {
        setIsConfirmWindowOpen(false);
        router.navigate({ to: "/chat/$id", params: { id: chatId || "" } });
    };

    const refetchStructures = () => {
        queryClient.invalidateQueries({
            queryKey: ["root-folders"],
        });
        queryClient.invalidateQueries({
            queryKey: ["structures-list"],
            exact: false,
        });
        queryClient.invalidateQueries({
            queryKey: ["root-chats"],
        });
        queryClient.invalidateQueries({
            queryKey: ["chat-path"],
            exact: false,
        });
    };

    const confirmDelete = () => {
        switch (structureToDelete.type) {
            case "FOLDER":
                deleteFolderMutation.mutate(structureToDelete.id, {
                    onSuccess: () => {
                        setIsConfirmWindowOpen(false);
                        refetchStructures();
                        router.navigate({
                            to: "/chat/$id",
                            params: { id: chatId || "" },
                        });
                    },
                });
                break;
            case "CHAT":
                deleteChatMutation.mutate(structureToDelete.id, {
                    onSuccess: () => {
                        setIsConfirmWindowOpen(false);
                        refetchStructures();
                        router.navigate({
                            to: "/chat/$id",
                            params: { id: chatId || "" },
                        });
                    },
                });
                break;
        }
    };

    return (
        <div
            className="bg-zinc-800 text-white p-6 rounded-2xl flex flex-col gap-10 max-w-[450px]"
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <div className="font-medium text-[18px]">
                <span>
                    Usunąć{" "}
                    {structureToDelete.type === "FOLDER" ? "folder" : "czat"}?
                </span>
            </div>
            <div className="text-[16px]">
                <span>
                    {structureToDelete.type === "FOLDER"
                        ? "Spowoduje to usunięcie wszystkich podfolderów i czatów z folderu:"
                        : "Spowoduje to usunięcie czatu:"}
                    <b className="font-medium"> {structureToDelete.name}</b>
                </span>
            </div>
            <div className="flex justify-end items-center gap-4">
                <button
                    className="hover:bg-zinc-700 px-3 py-2 rounded-2xl cursor-pointer transition-[background] duration-300 ease-in-out"
                    onClick={() => cancelDelete()}
                >
                    Anuluj
                </button>
                <button
                    className="bg-red-600 px-3 py-2 rounded-2xl cursor-pointer hover:bg-red-700 transition-[background] duration-300 ease-in-out"
                    onClick={() => confirmDelete()}
                >
                    Usuń
                </button>
            </div>
        </div>
    );
};

export default DeleteWindow;
