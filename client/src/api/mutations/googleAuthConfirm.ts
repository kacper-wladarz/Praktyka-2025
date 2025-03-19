import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useGoogleAuthConfirm = () => {
    return useMutation({
        mutationFn: async (auth: string) =>
            api.put(`/user/google-auth/registration/confirm/${auth}`),
    });
};
