import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useSettings = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["dashboard", "settings"],
        queryFn: async () =>
            await api.get("/dashboard/settings").then((res) => res.data),
    });
    return { data, isPending, error };
};
