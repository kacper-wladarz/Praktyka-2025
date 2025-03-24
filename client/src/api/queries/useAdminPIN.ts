import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useAdminPIN = () => {
    const { data, isPending } = useQuery({
        queryKey: ["auth", "admin"],
        queryFn: async () =>
            await api.get("/auth/admin").then((res) => res.data),
        refetchOnWindowFocus: true,
    });

    return { data, isPending };
};
