import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Loading from "@assets/Loading";
import { useAuth } from "@contexts/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { useState, ChangeEvent } from "react";
import { useLogin } from "@mutations/login";
import Input from "@components/Input";
import QueryError from "@components/QueryError";
import { useGoogleLogin } from "@mutations/googleLogin";
import Logged from "@components/Logged";

export const Route = createFileRoute("/")({
    component: Index,
    pendingComponent: () => <Loading />,
});

function Index() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<LoginData>({} as LoginData);
    const [error, setError] = useState<string | null>(null);

    const loginMutation = useLogin();
    const googleLoginMutation = useGoogleLogin();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const loginUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        loginMutation.mutate(data, {
            onSuccess: (res) => {
                auth.login(res.data.jwt);
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
    };

    const googleLoginSuccess = (response: CredentialResponse) => {
        const { credential } = response;
        googleLoginMutation.mutate(credential, {
            onSuccess: (res) => {
                auth.login(res.data.jwt);
                setError(null);
                navigate({
                    to: "/login/success",
                    state: { allow: true },
                });
            },
            onError: (err) => {
                auth.logout();
                if (err instanceof AxiosError) {
                    err.response && setError(err.response.data.message);
                } else {
                    setError("Wystąpił błąd podczas logowania");
                }
            },
        });
    };

    if (auth.isAuthenticated) {
        return <Logged />;
    }

    return (
        <div className="appear flex-1 w-full flex flex-col justify-center items-center gap-8">
            <span className="text-4xl font-extralight tracking-wide">
                Logowanie
            </span>
            <form className="text-xl font-extralight">
                <div className="flex flex-col items-stretch gap-6">
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
                        disabled={
                            loginMutation.isPending ||
                            googleLoginMutation.isPending
                        }
                    >
                        Zaloguj się
                    </button>
                </div>
            </form>
        </div>
    );
}
