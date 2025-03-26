import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormError from "@/components/FormError";
import { useCreateUser } from "@/api/mutations/createUser";
import { useState } from "react";
import { queryClient } from "@/main";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
    "/_dashboardLayout/dashboard/users/create"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const create = useCreateUser();
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const userSchema = z.object({
        login: z.string().email("Nieprawidłowy email"),
        password: z.string().min(8, "Hasło musi mieć conajmniej 8 znaków"),
        role: z.enum(["USER", "ADMIN"]),
    });

    const form = useForm({
        defaultValues: {
            login: "",
            password: "",
            role: "USER",
        },
        validators: {
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: userSchema,
        },
        onSubmit: ({ value }) => {
            create.mutate({ ...value } as DashboardUserToCreate, {
                onSuccess: () => {
                    navigate({ to: "/dashboard/users" });
                    queryClient.invalidateQueries({
                        queryKey: ["dashboard", "users"],
                    });
                },
                onError: (err) => setError(err.message),
            });
        },
    });

    return (
        <div className="appear flex flex-col gap-8">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.users.create.title")}
            </span>
            <form
                className="text-xl font-extralight flex flex-col gap-8 max-w-[260px]"
                onSubmit={(e) => e.preventDefault()}
            >
                <form.Field name="login">
                    {(field) => (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                className="form_input"
                                placeholder={t(
                                    "dashboard.panels.users.create.loginPlaceholder"
                                )}
                                value={field.state.value}
                                autoComplete="email"
                                onChange={(event) =>
                                    field.handleChange(event.target.value)
                                }
                            />
                            {field.state.meta.errors[0] && (
                                <FormError
                                    message={field.state.meta.errors[0].message}
                                />
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="password">
                    {(field) => (
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                className="form_input"
                                placeholder={t(
                                    "dashboard.panels.users.create.passwordPlaceholder"
                                )}
                                value={field.state.value}
                                autoComplete="current-password"
                                onChange={(event) =>
                                    field.handleChange(event.target.value)
                                }
                            />
                            {field.state.meta.errors[0] && (
                                <FormError
                                    message={field.state.meta.errors[0].message}
                                />
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="role">
                    {(field) => (
                        <div className="flex gap-4">
                            <div className="flex gap-1">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="USER"
                                    id="user_radio"
                                    checked={field.state.value === "USER"}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                />
                                <label
                                    htmlFor="user_radio"
                                    className="cursor-pointer"
                                >
                                    {t(
                                        "dashboard.panels.users.create.roleOptions.user"
                                    )}
                                </label>
                            </div>
                            <div className="flex gap-1">
                                <input
                                    className="cursor-pointer"
                                    type="radio"
                                    value="ADMIN"
                                    id="admin_radio"
                                    checked={field.state.value === "ADMIN"}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                />
                                <label
                                    htmlFor="admin_radio"
                                    className="cursor-pointer"
                                >
                                    {t(
                                        "dashboard.panels.users.create.roleOptions.admin"
                                    )}
                                </label>
                            </div>
                        </div>
                    )}
                </form.Field>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                    onClick={form.handleSubmit}
                    disabled={create.isPending}
                >
                    {t("dashboard.panels.users.create.createBtn")}
                </button>
                {error ? <FormError message={error} /> : null}
            </form>
        </div>
    );
}
