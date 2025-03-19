import { router } from "@/App";
import { useGlobalContext } from "@contexts/GlobalContext";
import { useDeleteChat } from "@mutations/deleteChat";
import { useDeleteFolder } from "@mutations/deleteFolder";
import { queryClient } from "@/main";

const DeleteWindow = () => {
    const deleteFolderMutation = useDeleteFolder();
    const deleteChatMutation = useDeleteChat();
    const { setIsConfirmWindowOpen, structureToDelete, chatId } =
        useGlobalContext();

    const cancelDelete = () => {
        setIsConfirmWindowOpen(false);
        router.navigate({ to: "/chat/$id", params: { id: chatId || "" } });
    };

    const refetchStructures = () => {
        queryClient.invalidateQueries({
            queryKey: ["folders"],
            exact: false,
        });
        queryClient.invalidateQueries({
            queryKey: ["chats"],
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
                    disabled={
                        deleteChatMutation.isPending ||
                        deleteFolderMutation.isPending
                    }
                >
                    Usuń
                </button>
            </div>
        </div>
    );
};

export default DeleteWindow;
