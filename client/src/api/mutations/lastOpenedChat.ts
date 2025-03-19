import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useUpdateChat = () => {
    return useMutation({
        mutationFn: async (id: string | null) =>
            await api
                .put(`/user/last-opened-chat`, { id })
                .then((res) => res.data),
    });
};
