import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import Loading from "@assets/Loading";
import { useGoogleAuthCancel } from "@mutations/googleAuthCancel";
import { useGoogleAuthConfirm } from "@mutations/googleAuthConfirm";
import { useAuth } from "@contexts/AuthContext";
import { useTranslation } from "react-i18next";

type SearchParams = {
    authCode: string;
    email: string;
};

export const Route = createFileRoute("/registration/confirm")({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>): SearchParams => {
        return {
            authCode: (search.authCode as string) || "",
            email: (search.email as string) || "",
        };
    },
    loaderDeps: ({ search: { authCode, email } }) => ({ authCode, email }),
    loader: ({ location }) => {
        if (!location.state?.allow) {
            return redirect({ to: location.state?.from || "/" });
        }
    },
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const navigate = useNavigate();
    const auth = useAuth();
    const { authCode, email } = Route.useSearch();
    const { t } = useTranslation();
    const cancelMutation = useGoogleAuthCancel();
    const confirmMutation = useGoogleAuthConfirm();

    const cancel = () => {
        cancelMutation.mutate(authCode, {
            onSuccess: () =>
                navigate({
                    to: "/registration/cancel",
                    state: { allow: true },
                }),
            onError: (err) =>
                navigate({
                    to: "/registration/error",
                    state: {
                        message: err.message,
                    },
                }),
        });
    };

    const confirm = () => {
        confirmMutation.mutate(authCode, {
            onSuccess: (res) => {
                auth.login(res.data.jwt);
                navigate({
                    to: "/registration/success",
                    state: { allow: true },
                });
            },
            onError: (err) =>
                navigate({
                    to: "/registration/error",
                    state: {
                        message: err.message,
                    },
                }),
        });
    };

    return (
        <div className="appear flex-1 flex flex-col justify-center items-center gap-6 text-xl">
            <span className="text-center">
                E-mail:{" "}
                <span className="underline font-extralight">{email}</span>
            </span>
            <div className="flex gap-6 flex-wrap px-4">
                <button
                    className="flex-1 px-4 py-2 bg-transparent text-white border border-white rounded-md cursor-pointer font-extralight hover:bg-[rgba(255,255,255,0.05)] transition-[background-color] duration-300 ease-in-out"
                    onClick={() => cancel()}
                >
                    {t("registration.confirm.cancelButton")}
                </button>
                <button
                    className="flex-1 whitespace-nowrap px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer font-extralight hover:bg-blue-600 transition-[background-color] ease-in-out duration-300"
                    onClick={() => confirm()}
                    disabled={
                        cancelMutation.isPending || confirmMutation.isPending
                    }
                >
                    {t("registration.confirm.confirmButton")}
                </button>
            </div>
        </div>
    );
}
