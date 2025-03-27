import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useUsers = () => {
    const { data, isPending, error } = useQuery<DashboardUser[]>({
        queryKey: ["dashboard", "users"],
        queryFn: async () =>
            await api.get("/dashboard/users").then((res) => res.data),
        retry: 0,
    });
    return { data, isPending, error };
};
