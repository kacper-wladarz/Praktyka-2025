import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useGoogleRegistration = () => {
    return useMutation({
        mutationFn: async (credential?: string) =>
            api.post(`/user/google-auth/registration`, {
                token: credential,
            }),
    });
};
