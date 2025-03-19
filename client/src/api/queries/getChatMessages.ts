import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useChatMessages = (chatId: string) => {
    const { data, error, isPending } = useQuery({
        queryKey: ["chats", chatId, "messages"],
        placeholderData: [],
        queryFn: async () =>
            await api.get(`/chats/${chatId}/messages`).then((res) => res.data),
    });

    return { data, error, isPending };
};
