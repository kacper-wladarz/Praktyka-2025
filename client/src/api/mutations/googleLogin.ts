import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: async (credential?: string) =>
            api.post(`/user/google-login`, {
                token: credential,
            }),
    });
};
