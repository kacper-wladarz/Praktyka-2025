import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const getChatPath = (chatId: string) => {
    const { reqAuth } = useContext(GlobalContext);
    const { data, error, isPending } = useQuery({
        queryKey: ["chat-path", chatId],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/structures/chat-path/${chatId}`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
        retry: 0,
    });

    return { data, error, isPending };
};
