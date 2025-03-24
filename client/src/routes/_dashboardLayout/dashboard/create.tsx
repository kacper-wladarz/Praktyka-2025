import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormError from "@/components/FormError";

export const Route = createFileRoute("/_dashboardLayout/dashboard/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
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
            console.log("Dane wysłane:", value);
            navigate({ to: "/dashboard" });
        },
    });

    return (
        <div className="flex flex-col gap-8">
            <span className="text-4xl font-extralight">Stwórz użytkownika</span>
            <form className="text-xl font-extralight flex flex-col gap-8 max-w-[260px]" onSubmit={(e) => e.preventDefault()}>
                    <form.Field name="login">
                        {(field) => (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    className="form_input"
                                    placeholder="Email"
                                    value={field.state.value}
                                    autoComplete="email"
                                    onChange={(event) => field.handleChange(event.target.value)}
                                />
                                {field.state.meta.errors[0] && <FormError message={field.state.meta.errors[0].message} />}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="password"
                                    className="form_input"
                                    placeholder="Hasło"
                                    value={field.state.value}
                                    autoComplete="current-password"
                                    onChange={(event) => field.handleChange(event.target.value)}
                                />
                                {field.state.meta.errors[0] && <FormError message={field.state.meta.errors[0].message} />}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="role">
                        {(field) => (
                            <div className="flex gap-4">
                                <div className="flex gap-1">
                                    <input
                                        className='cursor-pointer'
                                        type="radio"
                                        value="USER"
                                        id="user_radio"
                                        checked={field.state.value === "USER"}
                                        onChange={(event) => field.handleChange(event.target.value)}
                                    />
                                    <label htmlFor="user_radio" className='cursor-pointer'>Użytkownik</label>
                                </div>
                                <div className="flex gap-1">
                                    <input
                                        className='cursor-pointer'
                                        type="radio"
                                        value="ADMIN"
                                        id="admin_radio"
                                        checked={field.state.value === "ADMIN"}
                                        onChange={(event) => field.handleChange(event.target.value)}
                                    />
                                    <label htmlFor="admin_radio" className='cursor-pointer'>Admin</label>
                                </div>
                            </div>
                        )}
                    </form.Field>

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                        onClick={form.handleSubmit}
                    >
                        Stwórz
                    </button>
            </form>
        </div>
    );
}
