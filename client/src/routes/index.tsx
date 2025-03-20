import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Loading from "@assets/Loading";
import { useAuth } from "@contexts/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState, ChangeEvent } from "react";
import { useLogin } from "@mutations/login";
import Input from "@components/Input";
import QueryError from "@components/QueryError";
import { useGoogleLogin } from "@mutations/googleLogin";
import Logged from "@components/Logged";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
    component: Index,
    pendingComponent: () => <Loading />,
});

function Index() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<LoginData>({} as LoginData);
    const [error, setError] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
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
            onError: (err) => setError(err.message),
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
            onError: (err) => setError(err.message),
        });
    };

    if (auth.isAuthenticated) {
        return <Logged />;
    }

    return (
        <div className="appear flex-1 w-full flex flex-col justify-center items-center gap-8">
            <span className="text-4xl font-extralight tracking-wide">
                {t("login.header")}
            </span>
            <form className="text-xl font-extralight">
                <div className="flex flex-col items-stretch gap-6">
                    <Input
                        type="text"
                        name="login"
                        placeholder={t("login.loginInputPlaceholder")}
                        autoComplete="email"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder={t("login.passwordInputPlaceholder")}
                        autoComplete="current-password"
                        onChange={handleInputChange}
                    />
                    {error && <QueryError error={error} />}
                    <GoogleLogin
                        text="signin_with"
                        locale={i18n.language}
                        width={260}
                        logo_alignment="center"
                        onSuccess={(response) => googleLoginSuccess(response)}
                        onError={() =>
                            setError("Wystąpił błąd podczas logowania")
                        }
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={(event) => loginUser(event)}
                        disabled={
                            loginMutation.isPending ||
                            googleLoginMutation.isPending
                        }
                    >
                        {t("login.confirmButton")}
                    </button>
                </div>
            </form>
        </div>
    );
}
