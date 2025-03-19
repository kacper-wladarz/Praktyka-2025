import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useRootChats = () => {
    const { data, error, isPending } = useQuery({
        queryKey: ["chats", "root"],
        queryFn: async () =>
            await api.get(`/chats/list/root`).then((res) => res.data),
    });

    return { data, error, isPending };
};
