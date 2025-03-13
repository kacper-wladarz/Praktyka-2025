import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import Loading from "../../assets/Loading";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../main";
import { useContext } from "react";
import { GlobalContext } from "../../App";
import { googleAuthCancel } from "../../api/mutations/googleAuthCancel";
import { googleAuthConfirm } from "../../api/mutations/googleAuthConfirm";

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
    loader: ({ location }) => {
        if (!location.state?.allow) {
            return redirect({ to: location.state?.from || "/" });
        }
    },
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { setJWT } = useContext(GlobalContext);

    const { auth, email } = Route.useSearch();

    const cancelMutation = googleAuthCancel();
    const confirmMutation = googleAuthConfirm();

    const cancel = () => {
        cancelMutation.mutate(auth, {
            onSuccess: () =>
                navigate({
                    to: "/registration/cancel",
                    state: { allow: true },
                }),
            onError: (err) => {
                if (err instanceof AxiosError) {
                    err.response &&
                        navigate({
                            to: "/registration/error",
                            state: {
                                message: err.response.data.message,
                            },
                        });
                } else {
                    navigate({
                        to: "/registration/error",
                        state: {
                            message: "Wystąpił błąd podczas anulowania",
                        },
                    });
                }
            },
        });
    };

    const confirm = () => {
        confirmMutation.mutate(auth, {
            onSuccess: (res) => {
                setJWT(res.data.jwt);
                navigate({
                    to: "/registration/success",
                    state: { allow: true },
                });
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    err.response &&
                        navigate({
                            to: "/registration/error",
                            state: {
                                message: err.response.data.message,
                            },
                        });
                } else {
                    navigate({
                        to: "/registration/error",
                        state: {
                            message: "Wystąpił błąd podczas rejestracji",
                        },
                    });
                }
            },
        });
    };

    return (
        <div className="appear flex-1 flex flex-col justify-center items-center gap-6 text-xl">
            <span className="text-center">
                E-mail: <span className="underline">{email}</span>
            </span>
            <div className="flex gap-6 flex-wrap px-4">
                <button
                    className="flex-1 px-4 py-2 bg-transparent text-white border border-white rounded-md cursor-pointer font-normal hover:bg-[rgba(255,255,255,0.05)] transition-[background-color] duration-300 ease-in-out"
                    onClick={() => cancel()}
                >
                    Anuluj
                </button>
                <button
                    className="flex-1 whitespace-nowrap px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer font-normal hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                    onClick={() => confirm()}
                >
                    Stwórz konto
                </button>
            </div>
        </div>
    );
}
