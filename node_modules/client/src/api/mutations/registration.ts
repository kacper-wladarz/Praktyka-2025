import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const registration = () => {
    return useMutation({
        mutationFn: async (data: RegistrationData) =>
            axios.post(`${API_URL}/user/registration`, data),
    });
};
