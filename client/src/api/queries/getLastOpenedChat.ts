import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useLastOpenedChat = () => {
    const { data, error, isPending } = useQuery({
        queryKey: ["last-opened-chat"],
        queryFn: async () =>
            api.get(`/user/last-opened-chat`).then((res) => res.data),
    });

    return { data, error, isPending };
};
