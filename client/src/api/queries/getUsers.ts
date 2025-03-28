import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useUsers = (filters: UsersFilter) => {
    const { data, isPending, error } = useQuery<DashboardUser[]>({
        queryKey: ["dashboard", "users", filters],
        queryFn: async () =>
            await api
                .get(`/dashboard/users`, {
                    params: {
                        login: filters.login,
                        role: filters.role,
                    },
                })
                .then((res) => res.data),
        retry: 0,
    });
    return { data, isPending, error };
};
