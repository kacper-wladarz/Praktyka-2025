import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const createRootFolder = () => {
    const { reqAuth } = useContext(GlobalContext);
    return useMutation({
        mutationFn: async (newFolder: string) =>
            await axios
                .post(
                    `${API_URL}/folders/root`,
                    { name: newFolder },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
    });
};
