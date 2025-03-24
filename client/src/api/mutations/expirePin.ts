import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useExpirePIN = () => {
    return useMutation({
        mutationFn: async () => await api.patch("/auth/pin/expire"),
    });
};
