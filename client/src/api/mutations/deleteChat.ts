import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useDeleteChat = () => {
    return useMutation({
        mutationFn: async (chatId: string) =>
            await api.delete(`/chats/${chatId}`),
    });
};
