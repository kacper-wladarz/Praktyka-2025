import React, { useContext, useEffect, useState } from "react";
import { NewStructuresContext } from "./Folder";
import { createChat } from "../../../../api/mutations/createChat";
import { useQueryClient } from "@tanstack/react-query";
import { FoldersAndChatsContext } from "../../SideBar";
import { AxiosError } from "axios";
import { UUID } from "crypto";
import { InputsContext } from "../FoldersAndChats";
import RightArrow from "../../../../assets/RightArrow";

interface Props {
    folderId: string;
    newChatId: UUID;
}

const NewInsideChat = ({ folderId, newChatId }: Props) => {
    const { setIsOpen } = useContext(NewStructuresContext);
    const { setError } = useContext(FoldersAndChatsContext);
    const { openedInputId, setOpenedInputId } = useContext(InputsContext);
    const [newChat, setNewChat] = useState<string>("");
    const createNewChat = createChat();
    const queryClient = useQueryClient();

    const handleCreateKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.code === "Enter") {
            create();
        }
    };

    const create = () => {
        createNewChat.mutate(
            { newChat, id: folderId },
            {
                onSuccess: () => {
                    setIsOpen(true);
                    setOpenedInputId(null);
                    setNewChat("");
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
    };

    useEffect(() => {
        if (openedInputId === newChatId) {
            const element = document.getElementById(
                openedInputId
            ) as HTMLInputElement;
            if (element) element.focus();
        }
    }, [openedInputId]);

    return (
        <div
            className={`auto_height bg-zinc-900 flex items-stretch ${openedInputId === newChatId ? "h-auto opacity-100" : "h-0 opacity-0"} overflow-hidden transition-all duration-300 ease-in-out`}
        >
            <input
                className="w-full px-2 py-1 text-white font-semilight outline-none border border-[rgba(255,255,255,0.5)]"
                type="text"
                placeholder="Nazwa czatu"
                value={newChat}
                onChange={(event) => setNewChat(event.target.value)}
                onKeyDown={(event) => handleCreateKeyDown(event)}
                id={newChatId}
            />
            <button
                className="px-1 border border-l-0 border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-zinc-800 transition-[background] duration-300 ease-in-out"
                onClick={() => create()}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewInsideChat;
