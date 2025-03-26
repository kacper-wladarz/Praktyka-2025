import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: async (id: string) =>
            await api.delete(`/dashboard/users/delete/${id}`),
    });
};
