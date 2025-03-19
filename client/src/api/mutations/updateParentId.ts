import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationFn {
    structureId: string;
    parentId: string;
    type: "FOLDER" | "CHAT";
}

export const useUpdateParentId = () => {
    return useMutation({
        mutationFn: async ({ structureId, parentId, type }: MutationFn) =>
            await api.patch(`/structures/${type}/${structureId}`, {
                parentId,
            }),
    });
};
