import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationFn {
    chatId: string;
    messageId: string;
}

export const useGenerateAIAnswer = () => {
    return useMutation({
        mutationFn: async ({ chatId, messageId }: MutationFn) =>
            await api.post(`/chats/${chatId}/messages/${messageId}`, {}),
    });
};
