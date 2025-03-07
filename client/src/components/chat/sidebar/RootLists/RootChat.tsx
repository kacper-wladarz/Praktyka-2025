import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../../../main";
import { useContext } from "react";
import { GlobalContext } from "../../../../App";
import { router } from "../../../../App";

const RootChat = ({ chat }: { chat: Chat }) => {
    const { reqAuth } = useContext(GlobalContext);
    const openChat = useMutation({
        mutationFn: async ({ id }: { id: string }) =>
            await axios
                .put(
                    `${API_URL}/user/last-opened-chat`,
                    { id },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
        onSuccess: (res) => {
            router.navigate({ to: "/chat/$id", params: { id: res.chatId } });
        },
    });

    return (
        <div className="w-full" key={`root-folder-${chat.id}`}>
            <button
                className="w-full flex items-center gap-1 cursor-pointer px-4 font-semilight hover:bg-zinc-900 transition-[background] duration-200 ease-in-out"
                onClick={() => openChat.mutate({ id: chat.id })}
            >
                {chat.name}
            </button>
        </div>
    );
};

export default RootChat;
