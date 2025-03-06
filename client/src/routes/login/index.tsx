import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios, { AxiosError } from "axios";
import { useContext, useState, ChangeEvent } from "react";
import { GlobalContext } from "../../App";
import Input from "../../components/Input";
import QueryError from "../../components/QueryError";
import { API_URL } from "../../main";
import Loading from "../../components/Loading";

export const Route = createFileRoute("/login/")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const { setJWT } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [data, setData] = useState<LoginData>({} as LoginData);
    const [error, setError] = useState<string | null>(null);

    const loginMutation = useMutation({
        mutationFn: async () => axios.post(`${API_URL}/user/login`, data),
        onSuccess: (res) => {
            setJWT(res.data.jwt);
            setError(null);
            navigate({ to: "/" });
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                err.response && setError(err.response.data.message);
            } else {
                setError("Wystąpił błąd podczas logowania");
            }
        },
    });

    const googleLoginMutation = useMutation({
        mutationFn: async (credential?: string) =>
            axios.post(`${API_URL}/user/google-login`, { token: credential }),
        onSuccess: (res) => {
            setJWT(res.data.jwt);
            setError(null);
            navigate({
                to: "/login/success",
                state: { allow: true },
            });
        },
        onError: (err) => {
            setJWT(null);
            if (err instanceof AxiosError) {
                err.response && setError(err.response.data.message);
            } else {
                setError("Wystąpił błąd podczas logowania");
            }
        },
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const loginUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        loginMutation.mutate();
    };

    const googleLoginSuccess = (response: CredentialResponse) => {
        const { credential } = response;
        googleLoginMutation.mutate(credential);
    };

    return (
        <div className="appear flex-1 w-full flex flex-col justify-center items-center gap-8">
            <span className="text-4xl font-extralight tracking-wide">
                Logowanie
            </span>
            <form className="text-xl font-extralight">
                <div className="flex flex-col gap-6">
                    <Input
                        type="text"
                        name="login"
                        placeholder="Login"
                        autoComplete="email"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        autoComplete="current-password"
                        onChange={handleInputChange}
                    />
                    {error && <QueryError error={error} />}
                    <GoogleLogin
                        text="signin_with"
                        onSuccess={(response) => googleLoginSuccess(response)}
                        onError={() =>
                            setError("Wystąpił błąd podczas logowania")
                        }
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-normal hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={(event) => loginUser(event)}
                    >
                        Zaloguj się
                    </button>
                </div>
            </form>
        </div>
    );
}
