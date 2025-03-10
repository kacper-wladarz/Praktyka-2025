import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const createRootChat = () => {
    const { reqAuth } = useContext(GlobalContext);
    return useMutation({
        mutationFn: async (newChat: string) =>
            await axios
                .post(
                    `${API_URL}/chats/root`,
                    { name: newChat },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
    });
};
