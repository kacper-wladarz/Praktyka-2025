import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useRegistration = () => {
    return useMutation({
        mutationFn: async (data: RegistrationData) =>
            api.post(`/user/registration`, data),
    });
};
