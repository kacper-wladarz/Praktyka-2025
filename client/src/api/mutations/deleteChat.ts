import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const deleteChat = () => {
    const { reqAuth } = useContext(GlobalContext);
    return useMutation({
        mutationFn: async (chatId: string) =>
            await axios.delete(`${API_URL}/chats/${chatId}`, {
                headers: { ...reqAuth },
            }),
    });
};
