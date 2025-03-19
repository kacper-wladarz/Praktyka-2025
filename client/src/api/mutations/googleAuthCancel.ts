import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useGoogleAuthCancel = () => {
    return useMutation({
        mutationFn: async (auth: string) =>
            api.delete(`/user/google-auth/registration/cancel/${auth}`),
    });
};
