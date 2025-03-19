import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useCreateRootFolder = () => {
    return useMutation({
        mutationFn: async (newFolder: string) =>
            await api.post(`/folders/root`, { name: newFolder }),
    });
};
