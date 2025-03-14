import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAuth } from "../api/queries/getAuth";

const useAuth = () => {
    const [JWT, setJWT] = useState<string | null>(Cookies.get("jwt") || null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { data, error, isPending } = getAuth();

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
