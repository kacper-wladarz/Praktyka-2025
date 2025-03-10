import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

export const getFolderStructures = ({
    id,
    isOpen,
}: {
    id: string;
    isOpen: boolean;
}) => {
    const { reqAuth } = useContext(GlobalContext);

    const { data } = useQuery({
        queryKey: ["structures-list", id],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/structures/list?folder-id=${id}`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
        retry: 0,
        enabled: !!isOpen,
    });

    return { data };
};
