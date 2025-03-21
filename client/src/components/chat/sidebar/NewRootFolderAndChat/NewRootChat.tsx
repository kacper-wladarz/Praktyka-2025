import { RefObject, useEffect, useState } from "react";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useCreateRootChat } from "@mutations/createRootChat";
import RightArrow from "@assets/RightArrow";
import { queryClient } from "@/main";
import { useTranslation } from "react-i18next";

const NewRootChat = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLDivElement | null>;
}) => {
    const { isNewChat, setIsNewChat, setError } = useFoldersAndChatsContext();
    const [newChat, setNewChat] = useState<string>("");
    const create = useCreateRootChat();
    const { t } = useTranslation();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            createChat();
        }
    };

    const createChat = () => {
        create.mutate(newChat, {
            onSuccess: (res) => {
                queryClient.setQueryData(
                    ["chats", "root"],
                    ({ chats }: { chats: ChatItem[] }) => {
                        if (!chats) return { chats: [...chats] };
                        return { chats: [res.data.chat, ...chats] };
                    }
                );
            },
            onError: (error) => setError(error.message),
        });
        setNewChat("");
        setIsNewChat(false);
    };

    useEffect(() => {
        if (isNewChat && inputRef.current) {
            inputRef.current.focus();
        }

        if (!isNewChat) setNewChat("");
    }, [isNewChat]);

    return (
        <div
            className={`auto_height ${isNewChat ? "h-auto" : "h-0"} flex items-stretch transition-[height] duration-300 ease-in-out overflow-hidden`}
            ref={inputRef}
        >
            <input
                placeholder={t("sidebar.newChatPlaceholder")}
                id="new_chat_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                type="text"
                value={newChat}
                autoComplete="off"
                onKeyDown={(event) => handleKeyDown(event)}
                onChange={(event) => setNewChat(event.target.value)}
            />
            <button
                className="px-1 border border-l-0 border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-zinc-800 transition-[background] duration-300 ease-in-out"
                onClick={() => createChat()}
                disabled={create.isPending}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewRootChat;
