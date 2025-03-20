import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, ChangeEvent } from "react";
import Input from "@components/Input";
import QueryError from "@components/QueryError";
import Loading from "@assets/Loading";
import { useRegistration } from "@mutations/registration";
import { useGoogleRegistration } from "@mutations/googleRegistration";
import { useAuth } from "@contexts/AuthContext";
import Logged from "@components/Logged";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/registration/")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [data, setData] = useState<RegistrationData>({} as RegistrationData);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const registrationMutation = useRegistration();
    const googleRegistrationMutation = useGoogleRegistration();
    const { t, i18n } = useTranslation();

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
                auth.login(res.data.jwt);
                setError(null);
                navigate({
                    to: "/registration/success",
                    state: { allow: true },
                });
            },
            onError: (err) => setError(err.message),
        });
    };

    const googleRegisterUser = (response: CredentialResponse) => {
        const { credential } = response;
        googleRegistrationMutation.mutate(credential, {
            onSuccess: (res) => {
                const auth = res.data.authCode;
                if (auth) {
                    const email = res.data.email;
                    navigate({
                        to: "/registration/confirm",
                        search: { authCode: auth, email: email },
                        state: { allow: true },
                    });
                }
                setError(null);
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
                {t("registration.header")}
            </span>
            <form className="text-xl font-extralight">
                <div className="flex flex-col gap-6">
                    <Input
                        type="text"
                        name="login"
                        placeholder={t("registration.loginInputPlaceholder")}
                        autoComplete="email"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder={t("registration.passwordInputPlaceholder")}
                        autoComplete="new-password"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="repeatedPassword"
                        placeholder={t(
                            "registration.repeatPasswordInputPlaceholder"
                        )}
                        autoComplete="new-password"
                        onChange={handleInputChange}
                    />
                    <GoogleLogin
                        text="signup_with"
                        width={260}
                        locale={i18n.language}
                        logo_alignment="center"
                        onSuccess={(response) => googleRegisterUser(response)}
                        onError={() => setError("Błąd Google")}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={(event) => registerUser(event)}
                        disabled={
                            registrationMutation.isPending ||
                            googleRegistrationMutation.isPending
                        }
                    >
                        {t("registration.confirmButton")}
                    </button>
                </div>
            </form>
            {error && <QueryError error={error} />}
        </div>
    );
}
