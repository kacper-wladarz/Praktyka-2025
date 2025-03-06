import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../main";
import Cookies from "js-cookie";

const useAuth = () => {
    const [JWT, setJWT] = useState<string | null>(Cookies.get("jwt") || null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { data, error, isPending } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            let token = Cookies.get("jwt");
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
    });

    useEffect(() => {
        if (data) {
            Cookies.set("jwt", data.jwt);
            setJWT(data.jwt);
            setUserData({ login: data.login });
        }

        if (error || !data) {
            Cookies.remove("jwt");
            setJWT(null);
            setUserData(null);
        }
    }, [data]);

    return { JWT, setJWT, isPending, userData };
};

export default useAuth;
