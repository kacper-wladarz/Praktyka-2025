import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useStats = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () =>
            await api.get("dashboard/stats").then((res) => res.data),
    });
    return { data, isPending, error };
};
