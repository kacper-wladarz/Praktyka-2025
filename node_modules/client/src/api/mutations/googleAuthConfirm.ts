import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const googleAuthConfirm = () => {
    return useMutation({
        mutationFn: async (auth: string) =>
            axios.put(
                `${API_URL}/user/google-auth/registration/confirm/${auth}`
            ),
    });
};
