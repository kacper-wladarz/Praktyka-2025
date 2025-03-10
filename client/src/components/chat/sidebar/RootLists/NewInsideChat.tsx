import React, { useContext, useEffect, useState } from "react";
import { NewStructuresContext } from "./Folder";
import { createChat } from "../../../../api/mutations/createChat";
import { useQueryClient } from "@tanstack/react-query";
import { FoldersAndChatsContext } from "../../SideBar";
import { AxiosError } from "axios";

const NewInsideChat = ({ folderId }: { folderId: string }) => {
    const { setIsOpen, isNewChatOpen, setIsNewChatOpen, setIsNewFolderOpen } =
        useContext(NewStructuresContext);
    const { setError } = useContext(FoldersAndChatsContext);
    const [newChat, setNewChat] = useState<string>("");
    const createNewChat = createChat();
    const queryClient = useQueryClient();

    const handleCreateChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            createNewChat.mutate(
                { newChat, id: folderId },
                {
                    onSuccess: () => {
                        setIsOpen(true);
                        setIsNewChatOpen(false);
                    },
                    onError: (err) => {
                        if (err instanceof AxiosError) {
                            err.response && setError(err.response.data.message);
                        } else {
                            setError("Wystąpił błąd podczas tworzenia czatu");
                        }
                    },
                    onSettled: () => {
                        queryClient.invalidateQueries({
                            queryKey: ["structures-list"],
                        });
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (isNewChatOpen) setIsNewFolderOpen(false);
    }, [isNewChatOpen]);

    return (
        <div
            className={`auto_height ${isNewChatOpen ? "h-auto" : "h-0"} overflow-hidden transition-[height] duration-300 ease-in-out`}
        >
            <input
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                type="text"
                placeholder="Nazwa czatu"
                value={newChat}
                onChange={(event) => setNewChat(event.target.value)}
                onKeyDown={(event) => handleCreateChat(event)}
            />
        </div>
    );
};

export default NewInsideChat;
