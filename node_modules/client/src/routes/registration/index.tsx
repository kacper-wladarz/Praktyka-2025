import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios, { AxiosError } from "axios";
import { useState, ChangeEvent, useContext } from "react";
import Input from "../../components/Input";
import QueryError from "../../components/QueryError";
import { API_URL } from "../../main";
import Loading from "../../assets/Loading";
import { GlobalContext } from "../../App";
import { registration } from "../../api/mutations/registration";
import { googleRegistration } from "../../api/mutations/googleRegistration";

export const Route = createFileRoute("/registration/")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { setJWT } = useContext(GlobalContext);
    const [data, setData] = useState<RegistrationData>({} as RegistrationData);
    const [error, setError] = useState<string | null>(null);

    const registrationMutation = registration();
    const googleRegistrationMutation = googleRegistration();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const registerUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        registrationMutation.mutate(data, {
            onSuccess: (res) => {
                setJWT(res.data.jwt);
                setError(null);
                navigate({
                    to: "/registration/success",
                    state: { allow: true },
                });
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    err.response && setError(err.response.data.message);
                } else {
                    setError("Wystąpił błąd podczas rejestracji");
                }
            },
        });
    };

    const googleRegistrationSuccess = (response: CredentialResponse) => {
        const { credential } = response;
        googleRegistrationMutation.mutate(credential, {
            onSuccess: (res) => {
                const auth = res.data.authCode;
                if (auth) {
                    const email = res.data.email;
                    navigate({
                        to: "/registration/confirm",
                        search: { auth: auth, email: email },
                        state: { allow: true },
                    });
                } else {
                    setError("Wystąpił błąd podczas rejestracji");
                }
                setError(null);
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    err.response && setError(err.response.data.message);
                } else {
                    setError("Wystąpił błąd podczas logowania");
                }
            },
        });
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
                    <GoogleLogin
                        text="signup_with"
                        onSuccess={(response) =>
                            googleRegistrationSuccess(response)
                        }
                        onError={() => setError("Błąd Google")}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-normal hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={(event) => registerUser(event)}
                    >
                        Zarejestruj się
                    </button>
                </div>
            </form>
            {error && <QueryError error={error} />}
        </div>
    );
}
