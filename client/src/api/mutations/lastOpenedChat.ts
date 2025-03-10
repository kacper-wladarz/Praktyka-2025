import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { GlobalContext } from "../../App";
import { API_URL } from "../../main";
import { useContext } from "react";

export const updateChat = () => {
    const { reqAuth } = useContext(GlobalContext);
    return useMutation({
        mutationFn: async (id: string | null) =>
            await axios
                .put(
                    `${API_URL}/user/last-opened-chat`,
                    { id },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
    });
};
