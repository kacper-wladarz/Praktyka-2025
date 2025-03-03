import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/Input";
import { ChangeEvent, useState } from "react";
import Loading from "../components/Loading";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "../main";
import QueryError from "../components/QueryError";
import { GoogleLogin } from "@react-oauth/google";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const [data, setData] = useState<LoginData>({} as LoginData);
    const [error, setError] = useState<string | null>(null);
    const loginMutation = useMutation({
        mutationFn: async () => axios.post(`${API_URL}/user/login`, data),
        onSuccess: (res) => console.log(res),
        onError: (err) => {
            if (err instanceof AxiosError) {
                err.response && setError(err.response.data.message);
            } else {
                setError("Wystąpił błąd podczas rejestracji");
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
                        onSuccess={(credentials) => console.log(credentials)}
                        onError={() => console.log("GOOGLE ERROR")}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-normal"
                        onClick={(event) => loginUser(event)}
                    >
                        Zaloguj się
                    </button>
                </div>
            </form>
        </div>
    );
}
