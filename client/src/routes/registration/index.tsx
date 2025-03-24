import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Loading from "@assets/Loading";
import { useRegistration } from "@mutations/registration";
import { useGoogleRegistration } from "@mutations/googleRegistration";
import { useAuth } from "@contexts/AuthContext";
import Logged from "@components/Logged";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormError from "@/components/FormError";

export const Route = createFileRoute("/registration/")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const registrationMutation = useRegistration();
    const googleRegistrationMutation = useGoogleRegistration();
    const { t, i18n } = useTranslation();
    const userSchema = z.object({
        login: z.string().email(t("registration.validation.invalidLogin")),
        password: z.string().min(8, t("registration.validation.minPassword")),
        repeatedPassword: z
            .string()
            .min(8, t("registration.validation.minRepeatedPassword")),
    });
    const form = useForm({
        defaultValues: {
            login: "",
            password: "",
            repeatedPassword: "",
        },
        validators: {
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: userSchema,
        },
        onSubmit: ({ value }) => {
            registerUser(value);
        },
    });

    const registerUser = (data: RegistrationData) => {
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
            <form
                className="text-xl font-extralight max-w-[340px] w-fit"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-col gap-6">
                    <form.Field
                        name="login"
                        children={(field) => {
                            return (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        className="form_input"
                                        placeholder={t(
                                            "registration.loginInputPlaceholder"
                                        )}
                                        autoComplete="email"
                                        value={field.state.value}
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
                                            "registration.passwordInputPlaceholder"
                                        )}
                                        autoComplete="new-password"
                                        value={field.state.value}
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
                        name="repeatedPassword"
                        children={(field) => {
                            return (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="password"
                                        className="form_input"
                                        placeholder={t(
                                            "registration.repeatPasswordInputPlaceholder"
                                        )}
                                        autoComplete="new-password"
                                        value={field.state.value}
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
                        text="signup_with"
                        width={340}
                        locale={i18n.language}
                        logo_alignment="center"
                        onSuccess={(response) => googleRegisterUser(response)}
                        onError={() =>
                            setError(i18n.t("registration.googleError"))
                        }
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={form.handleSubmit}
                        disabled={
                            registrationMutation.isPending ||
                            googleRegistrationMutation.isPending
                        }
                    >
                        {t("registration.confirmButton")}
                    </button>
                </div>
            </form>
            {error && <FormError message={error} />}
        </div>
    );
}
