import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const deleteFolder = () => {
    const { reqAuth } = useContext(GlobalContext);
    return useMutation({
        mutationFn: async (folderId: string) =>
            await axios.delete(`${API_URL}/folders/${folderId}`, {
                headers: { ...reqAuth },
            }),
    });
};
