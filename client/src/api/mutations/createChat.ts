import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const createChat = () => {
    const { reqAuth } = useContext(GlobalContext);

    return useMutation({
        mutationFn: async ({ newChat, id }: { newChat: string; id: string }) =>
            await axios.post(
                `${API_URL}/chats`,
                { name: newChat, folderId: id },
                { headers: { ...reqAuth } }
            ),
    });
};
