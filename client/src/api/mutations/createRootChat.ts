import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useCreateRootChat = () => {
    return useMutation({
        mutationFn: async (newChat: string) =>
            await api.post(`/chats/root`, { name: newChat }),
    });
};
