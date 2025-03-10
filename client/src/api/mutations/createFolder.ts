import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const createFolder = () => {
    const { reqAuth } = useContext(GlobalContext);

    return useMutation({
        mutationFn: async ({
            newFolder,
            id,
        }: {
            newFolder: string;
            id: string;
        }) =>
            await axios.post(
                `${API_URL}/folders`,
                { name: newFolder, folderId: id },
                { headers: { ...reqAuth } }
            ),
    });
};
