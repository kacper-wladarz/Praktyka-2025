import { useQueryClient } from "@tanstack/react-query";
import { RefObject, useContext, useEffect, useState } from "react";
import { FoldersAndChatsContext } from "../../SideBar";
import { AxiosError } from "axios";
import { createRootChat } from "../../../../api/mutations/createRootChat";

const NewRootChat = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLInputElement | null>;
}) => {
    const queryClient = useQueryClient();
    const { isNewChat, setIsNewChat, setError } = useContext(
        FoldersAndChatsContext
    );
    const [newChat, setNewChat] = useState<string>("");
    const create = createRootChat();

    const createChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            create.mutate(newChat, {
                onSettled: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["root-chats"],
                    });
                },
                onError: (error) => {
                    if (error instanceof AxiosError) {
                        error.response && setError(error.response.data.message);
                    } else {
                        setError("Wystąpił błąd");
                    }
                },
            });
            setNewChat("");
            setIsNewChat(false);
        }
    };

    useEffect(() => {
        if (isNewChat && inputRef.current) {
            inputRef.current.focus();
        }

        if (!isNewChat) setNewChat("");
    }, [isNewChat]);

    return (
        <div
            className={`auto_height ${isNewChat ? "h-auto" : "h-0"} transition-[height] duration-300 ease-in-out overflow-hidden`}
        >
            <input
                placeholder="Nazwa czatu"
                id="new_chat_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                ref={inputRef}
                type="text"
                value={newChat}
                autoComplete="off"
                onChange={(event) => setNewChat(event.target.value)}
                onKeyDown={(event) => createChat(event)}
            />
        </div>
    );
};

export default NewRootChat;
