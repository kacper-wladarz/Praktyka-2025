import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const googleRegistration = () => {
    return useMutation({
        mutationFn: async (credential?: string) =>
            axios.post(`${API_URL}/user/google-auth/registration`, {
                token: credential,
            }),
    });
};
