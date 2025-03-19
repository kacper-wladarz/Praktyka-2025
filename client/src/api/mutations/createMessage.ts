import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationFn {
    chatId: string;
    question: string;
}

export const useCreateMessage = () => {
    return useMutation({
        mutationFn: async ({ chatId, question }: MutationFn) =>
            await api.post(`/chats/${chatId}/messages`, { question }),
    });
};
