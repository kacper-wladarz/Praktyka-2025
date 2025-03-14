import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../../App";
import { API_URL } from "../../main";

export const getRootChats = () => {
    const { reqAuth } = useContext(GlobalContext);

    const { data, error, isPending } = useQuery({
        queryKey: ["root-chats"],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/chats/list/root`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
    });

    return { data, error, isPending };
};
