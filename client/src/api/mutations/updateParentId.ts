import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

interface MutationProps {
    structureId: string;
    parentId: string;
    type: "FOLDER" | "CHAT";
}

export const updateParentId = () => {
    const { reqAuth } = useContext(GlobalContext);

    return useMutation({
        mutationFn: async ({ structureId, parentId, type }: MutationProps) =>
            await axios.patch(
                `${API_URL}/structures/${type}/${structureId}`,
                {
                    parentId,
                },
                { headers: { ...reqAuth } }
            ),
    });
};
