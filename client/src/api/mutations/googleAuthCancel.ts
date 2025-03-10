import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const googleAuthCancel = () => {
    return useMutation({
        mutationFn: async (auth: string) =>
            axios.delete(
                `${API_URL}/user/google-auth/registration/cancel/${auth}`
            ),
    });
};
