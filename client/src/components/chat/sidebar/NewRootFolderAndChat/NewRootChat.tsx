import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ref, useContext, useState } from "react";
import { GlobalContext } from "../../../../App";
import { FoldersAndChatsContext } from "../../SideBar";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../../../main";

const NewRootChat = ({ inputRef }: { inputRef: Ref<HTMLInputElement> }) => {
    const { reqAuth } = useContext(GlobalContext);
    const { isNewChat, setIsNewChat, setError } = useContext(
        FoldersAndChatsContext
    );
    const queryClient = useQueryClient();
    const [newChat, setNewChat] = useState<string>("");

    const folderMutation = useMutation({
        mutationFn: async () =>
            await axios
                .post(
                    `${API_URL}/chats/root`,
                    { name: newChat },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["root-chats"] });
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                error.response && setError(error.response.data.message);
            } else {
                setError("Wystąpił błąd");
            }
        },
        onSettled: () => {
            setNewChat("");
            setIsNewChat(false);
        },
    });
    const createChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            folderMutation.mutate();
        }
    };

    return (
        <div
            className={`auto_height ${isNewChat ? "h-auto" : "h-0"} transition-[height] duration-300 ease-in-out overflow-hidden`}
        >
            <input
                placeholder="Nazwa czatu"
                autoFocus
                id="new_chat_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                ref={inputRef}
                type="text"
                autoComplete="off"
                onChange={(event) => setNewChat(event.target.value)}
                onKeyDown={(event) => createChat(event)}
            />
        </div>
    );
};

export default NewRootChat;
