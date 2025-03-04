import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../main";

const useAuth = () => {
    const [JWT, setJWT] = useState<string | null>(localStorage.getItem("jwt"));
    const { data, error, isPending } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            let token = localStorage.getItem("jwt");
            if (!token) {
                token = "";
            }
            return axios
                .get(`${API_URL}/user/auth`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((res) => res.data);
        },
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 0,
        retryDelay: 1000,
    });

    useEffect(() => {
        console.log(data);
        if (data) {
            localStorage.setItem("jwt", data.jwt);
            setJWT(data.jwt);
        }

        if (error || !data) {
            localStorage.removeItem("jwt");
            setJWT(null);
        }
    }, [data]);

    return { JWT, setJWT, isPending };
};

export default useAuth;
