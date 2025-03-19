import axios from "axios";
import { getCookie } from "../functions/getCookie";
import { router } from "@/App";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer " + getCookie("jwt") || "";
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                router.navigate({ to: "/" });
            }
            if (error.response.status === 404) {
                router.navigate({
                    to: "/not-found",
                });
            }
        }
    }
);
