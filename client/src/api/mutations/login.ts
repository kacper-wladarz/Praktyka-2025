import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: UserData) => api.post(`/user/login`, data),
    });
};
