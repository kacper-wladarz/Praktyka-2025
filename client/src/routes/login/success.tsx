import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Loading from "@assets/Loading";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/login/success")({
    loader: ({ location }) => {
        if (!location.state?.allow) {
            return redirect({ to: "/" });
        }
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const { t } = useTranslation();

    return (
        <div className="appear flex-1 flex flex-col justify-center items-center gap-6 text-xl">
            <span className="text-center">{t("login.success.text")}</span>
            <Link
                to="/chat"
                className="text-center cursor pointer text-sky-400 hover:text-sky-600 transition-[color] duration-300 ease-in-out"
            >
                {t("login.success.link")}
            </Link>
        </div>
    );
}
