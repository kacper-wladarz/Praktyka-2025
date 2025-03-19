import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationFn {
    newChat: string;
    id: string;
}

export const useCreateChat = () => {
    return useMutation({
        mutationFn: async ({ newChat, id }: MutationFn) =>
            await api.post(`/chats`, {
                name: newChat,
                folderId: id,
            }),
    });
};
