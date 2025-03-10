import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const getSingleChat = (id: string) => {
    const { reqAuth } = useContext(GlobalContext);

    const { data, error, isPending } = useQuery({
        queryKey: ["chat", id],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/chats/${id}`, { headers: { ...reqAuth } })
                .then((res) => res.data),
        retry: 0,
    });

    return { data, error, isPending };
};
