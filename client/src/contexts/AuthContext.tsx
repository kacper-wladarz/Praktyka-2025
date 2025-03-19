import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { getCookie } from "../functions/getCookie";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { removeCookie } from "../functions/removeCookie";
import { setCookie } from "../functions/setCookie";
import { queryClient } from "../main";

const AuthContext = createContext<AuthContext | null>(null);

interface Props {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: Props) => {
    const [JWT, setJWT] = useState<string | null>(getCookie("jwt"));
    const [user, setUser] = useState<UserData | null>(null);
    const isAuthenticated = !!JWT;
    const { data, error } = useQuery({
        queryKey: ["auth"],
        placeholderData: null,
        queryFn: async () => {
            return api.get(`/auth`).then((res) => res.data);
        },
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 0,
    });

    const { data: userData } = useQuery({
        queryKey: ["user", "data"],
        queryFn: async () =>
            await api.get("/user/data").then((res) => res.data),
        enabled: !!JWT,
        refetchOnWindowFocus: true,
        staleTime: 0,
        retry: 0,
    });

    useEffect(() => {
        if (data !== null) {
            if (data) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                setCookie("jwt", data.jwt, expires.toUTCString());
                setJWT(data.jwt);
            }

            if (error || data === undefined) {
                removeCookie("jwt");
                setJWT(null);
            }
        }
    }, [data]);

    useEffect(() => {
        if (userData) {
            setUser({ login: userData.login });
        }
    }, [userData]);

    const logout = () => {
        setJWT(null);
        queryClient.invalidateQueries({ queryKey: ["user", "data"] });
        removeCookie("jwt");
    };

    const login = (jwt: string) => {
        setJWT(jwt);
        queryClient.invalidateQueries({ queryKey: ["user", "data"] });
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);
        setCookie("jwt", jwt, expires.toUTCString());
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, JWT, user, logout, login }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within AuthContextProvider");
    }

    return context;
};
