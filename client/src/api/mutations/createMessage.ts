import { useContext } from "react";
import { GlobalContext } from "../../App";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const createMessage = () => {
    const { reqAuth } = useContext(GlobalContext);

    return useMutation({
        mutationFn: async ({
            chatId,
            question,
        }: {
            chatId: string;
            question: string;
        }) =>
            await axios.post(
                `${API_URL}/chats/${chatId}/messages`,
                { question },
                { headers: { ...reqAuth } }
            ),
    });
};
