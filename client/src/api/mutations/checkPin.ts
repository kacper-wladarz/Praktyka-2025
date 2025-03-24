import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useCheckPIN = () => {
    return useMutation({
        mutationFn: async (pin: string) => await api.post("/auth/pin", { pin }),
    });
};
