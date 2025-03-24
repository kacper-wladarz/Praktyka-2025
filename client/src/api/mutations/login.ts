import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginData) => api.post(`/user/login`, data),
    });
};
