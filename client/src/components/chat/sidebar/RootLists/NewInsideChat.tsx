import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { UUID } from "crypto";
import RightArrow from "@assets/RightArrow";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useNewStructuresContext } from "@contexts/NewStructuresContext";
import { useInputsContext } from "@contexts/InputsContext";
import { useCreateChat } from "@mutations/createChat";
import { queryClient } from "@/main";
import { useTranslation } from "react-i18next";

interface Props {
    folderId: string;
    newChatId: UUID;
}

const NewInsideChat = ({ folderId, newChatId }: Props) => {
    const { setIsOpen } = useNewStructuresContext();
    const { setError } = useFoldersAndChatsContext();
    const { openedInputId, setOpenedInputId } = useInputsContext();
    const [newChat, setNewChat] = useState<string>("");
    const createNewChat = useCreateChat();
    const { t } = useTranslation();

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
                onSuccess: (res) => {
                    setIsOpen(true);
                    setOpenedInputId(null);
                    setNewChat("");
                    queryClient.setQueryData(
                        ["folders", folderId],
                        ({ list }: { list: (Folder | Chat)[] }) => {
                            if (!list) return { list: [...list] };
                            return { list: [...list, res.data.chat] };
                        }
                    );
                },
                onError: (err) => {
                    if (err instanceof AxiosError) {
                        err.response && setError(err.response.data.message);
                    } else {
                        setError("Wystąpił błąd podczas tworzenia czatu");
                    }
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
                placeholder={t("sidebar.newChatPlaceholder")}
                value={newChat}
                onChange={(event) => setNewChat(event.target.value)}
                onKeyDown={(event) => handleCreateKeyDown(event)}
                id={newChatId}
            />
            <button
                className="px-1 border border-l-0 border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-zinc-800 transition-[background] duration-300 ease-in-out"
                onClick={() => create()}
                disabled={createNewChat.isPending}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewInsideChat;
