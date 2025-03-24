import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Loading from "@assets/Loading";
import { useAuth } from "@contexts/AuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useLogin } from "@mutations/login";
import { useGoogleLogin } from "@mutations/googleLogin";
import Logged from "@components/Logged";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormError from "@/components/FormError";

export const Route = createFileRoute("/")({
    component: Index,
    pendingComponent: () => <Loading />,
});

function Index() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const loginMutation = useLogin();
    const googleLoginMutation = useGoogleLogin();
    const userSchema = z.object({
        login: z.string().email(t("login.validation.invalidLogin")),
        password: z.string().min(8, t("login.validation.minPassword")),
    });
    const form = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
        validators: {
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: userSchema,
        },
        onSubmit: ({ value }) => {
            loginUser(value);
        },
    });

    const loginUser = (data: LoginData) => {
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
            <form
                className="text-xl font-extralight max-w-[260px]"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-col items-stretch gap-6">
                    <form.Field
                        name="login"
                        children={(field) => {
                            return (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder={t(
                                            "login.loginInputPlaceholder"
                                        )}
                                        value={field.state.value}
                                        autoComplete="email"
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value
                                            )
                                        }
                                    />
                                    {field.state.meta.errors[0] && (
                                        <FormError
                                            message={
                                                field.state.meta.errors[0]
                                                    .message
                                            }
                                        />
                                    )}
                                </div>
                            );
                        }}
                    />
                    <form.Field
                        name="password"
                        children={(field) => {
                            return (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="password"
                                        className="form_input"
                                        placeholder={t(
                                            "login.passwordInputPlaceholder"
                                        )}
                                        value={field.state.value}
                                        autoComplete="current-password"
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value
                                            )
                                        }
                                    />
                                    {field.state.meta.errors[0] && (
                                        <FormError
                                            message={
                                                field.state.meta.errors[0]
                                                    .message
                                            }
                                        />
                                    )}
                                </div>
                            );
                        }}
                    />
                    <GoogleLogin
                        text="signin_with"
                        locale={i18n.language}
                        width={260}
                        logo_alignment="center"
                        onSuccess={(response) => googleLoginSuccess(response)}
                        onError={() => setError(i18n.t("login.googleError"))}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={form.handleSubmit}
                        disabled={
                            loginMutation.isPending ||
                            googleLoginMutation.isPending
                        }
                    >
                        {t("login.confirmButton")}
                    </button>
                    {error && <FormError message={error} />}
                </div>
            </form>
        </div>
    );
}
