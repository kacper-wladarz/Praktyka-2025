import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/Input";
import { ChangeEvent, useState } from "react";
import Loading from "../components/Loading";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../main";
import QueryError from "../components/QueryError";

export const Route = createFileRoute("/registration")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const [data, setData] = useState<RegistrationData>({} as RegistrationData);
    const [error, setError] = useState<string | null>(null);
    const registrationMutation = useMutation({
        mutationFn: async () =>
            axios.post(`${API_URL}/user/registration`, data),
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

    const registerUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        registrationMutation.mutate();
    };

    return (
        <div className="appear flex-1 w-full flex flex-col justify-center items-center gap-8">
            <span className="text-4xl font-extralight tracking-wide">
                Rejestracja
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
                        autoComplete="new-password"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="repeatedPassword"
                        placeholder="Powtórz hasło"
                        autoComplete="new-password"
                        onChange={handleInputChange}
                    />
                    {error && <QueryError error={error} />}
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-normal"
                        onClick={(event) => registerUser(event)}
                    >
                        Zarejestruj się
                    </button>
                </div>
            </form>
        </div>
    );
}
