import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useChatPath = (chatId: string) => {
    const { data, error, isPending } = useQuery({
        queryKey: ["chat", "path", chatId],
        queryFn: async () =>
            await api
                .get(`/structures/chat-path/${chatId}`)
                .then((res) => res.data),
        retry: 0,
    });

    return { data, error, isPending };
};
