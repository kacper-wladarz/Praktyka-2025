import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";

export const login = () => {
    return useMutation({
        mutationFn: async (data: UserData) =>
            axios.post(`${API_URL}/user/login`, data),
    });
};
