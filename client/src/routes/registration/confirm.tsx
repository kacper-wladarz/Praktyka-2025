import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Loading from "../../components/Loading";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";

type SearchParams = {
    auth: string;
    email: string;
};

export const Route = createFileRoute("/registration/confirm")({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): SearchParams => {
        return {
            auth: (search.auth as string) || "",
            email: (search.email as string) || "",
        };
    },
    loaderDeps: ({ search: { auth, email } }) => ({ auth, email }),
    loader: async ({ deps: { auth, email } }) => ({ auth, email }),
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { setJWT } = useContext(GlobalContext);

    const { auth, email } = Route.useSearch();

    const cancelMutation = useMutation({
        mutationFn: async () =>
            axios.delete(
                `${API_URL}/user/google-auth/registration/cancel/${auth}`
            ),
        onSuccess: () =>
            navigate({
                to: "/registration/cancel",
            }),
        onError: (err) => {
            if (err instanceof AxiosError) {
                err.response &&
                    navigate({
                        to: "/registration/error",
                        state: { message: err.response.data.message },
                    });
            } else {
                navigate({
                    to: "/registration/error",
                    state: { message: "Wystąpił błąd podczas anulowania" },
                });
            }
        },
    });

    const confirmMutation = useMutation({
        mutationFn: async () =>
            axios.put(
                `${API_URL}/user/google-auth/registration/confirm/${auth}`
            ),
        onSuccess: (res) => {
            setJWT(res.data.jwt);
            navigate({ to: "/registration/success" });
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                err.response &&
                    navigate({
                        to: "/registration/error",
                        state: { message: err.response.data.message },
                    });
            } else {
                navigate({
                    to: "/registration/error",
                    state: { message: "Wystąpił błąd podczas rejestracji" },
                });
            }
        },
    });

    return (
        <div className="appear">
            <span>{email}</span>
            <button onClick={() => confirmMutation.mutate()}>
                Stwórz konto
            </button>
            <button onClick={() => cancelMutation.mutate()}>Anuluj</button>
        </div>
    );
}
