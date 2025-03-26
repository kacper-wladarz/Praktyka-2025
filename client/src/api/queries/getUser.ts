import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useUser = (id: string) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["dashboard", "user", id],
        queryFn: async () =>
            await api.get(`/dashboard/users/${id}`).then((res) => res.data),
    });
    return { data, isPending, error };
};
