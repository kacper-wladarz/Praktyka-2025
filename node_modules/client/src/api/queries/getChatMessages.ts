import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const getChatMessages = (chatId: string) => {
    const { reqAuth } = useContext(GlobalContext);

    const { data, error, isPending } = useQuery({
        queryKey: ["chatMessages", chatId],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/chats/${chatId}/messages`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
    });

    return { data, error, isPending };
};
