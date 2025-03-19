import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useDeleteFolder = () => {
    return useMutation({
        mutationFn: async (folderId: string) =>
            await api.delete(`/folders/${folderId}`),
    });
};
