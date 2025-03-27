import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useUpdateSettings = () => {
    return useMutation({
        mutationFn: async (settings: Record<string, string>) =>
            await api.put("/dashboard/settings", { settings }),
    });
};
