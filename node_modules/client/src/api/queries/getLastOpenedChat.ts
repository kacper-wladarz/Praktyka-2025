import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { GlobalContext } from "../../App";
import { useContext } from "react";

export const getLastOpenedChat = () => {
    const { reqAuth } = useContext(GlobalContext);
    const { data, error, isPending } = useQuery({
        queryKey: ["last-opened-chat"],
        queryFn: async () =>
            axios
                .get(`${API_URL}/user/last-opened-chat`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
    });

    return { data, error, isPending };
};
