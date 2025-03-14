import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../../App";
import { API_URL } from "../../main";

export const generateAIAnswer = () => {
    const { reqAuth } = useContext(GlobalContext);

    return useMutation({
        mutationFn: async ({
            chatId,
            messageId,
        }: {
            chatId: string;
            messageId: string;
        }) =>
            await axios.post(
                `${API_URL}/chats/${chatId}/messages/${messageId}`,
                {},
                { headers: { ...reqAuth } }
            ),
    });
};
