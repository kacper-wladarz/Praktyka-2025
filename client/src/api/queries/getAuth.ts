import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../main";
import Cookies from "js-cookie";

export const getAuth = () => {
    const { data, error, isPending } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            let token = Cookies.get("jwt");
            if (!token) {
                token = "";
            }
            return axios
                .get(`${API_URL}/auth`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => res.data);
        },
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 0,
    });

    return { data, error, isPending };
};
