import axios from "axios";
import { getCookie } from "../functions/getCookie";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer " + getCookie("jwt") || "";
    config.headers["X-lang"] = localStorage.getItem("lng") || "pl";
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (typeof error.response.data.message === "string") {
                return Promise.reject({ message: error.response.data.message });
            }
            return Promise.reject({ message: error.response.data.message[0] });
        }

        return Promise.reject(error);
    }
);
