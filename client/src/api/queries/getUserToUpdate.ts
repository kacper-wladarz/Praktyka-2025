import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useUserToUpdate = (id: string) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["dashboard", "user", "update", id],
        queryFn: async () =>
            await api
                .get(`/dashboard/users/to-update/${id}`)
                .then((res) => res.data),
    });
    return { data, isPending, error };
};
