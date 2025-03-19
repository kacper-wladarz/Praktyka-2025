import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationFn {
    newFolder: string;
    id: string;
}

export const useCreateFolder = () => {
    return useMutation({
        mutationFn: async ({ newFolder, id }: MutationFn) =>
            await api.post(`/folders`, {
                name: newFolder,
                folderId: id,
            }),
    });
};
