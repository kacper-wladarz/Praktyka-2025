import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useRootFolders = () => {
    const { data, error, isPending } = useQuery({
        queryKey: ["folders", "root"],
        queryFn: async () =>
            await api.get(`/folders/list/root`).then((res) => res.data),
    });

    return { data, error, isPending };
};
