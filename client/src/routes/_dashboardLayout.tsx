import { useAdminPIN } from "@/api/queries/useAdminPIN";
import { router } from "@/App";
import Loading from "@/assets/Loading";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PINPad from "@/components/dashboard/PINPad";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_dashboardLayout")({
    beforeLoad: ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: "/" });
        }
    },
    loader: ({ location }) => {
        return location.pathname;
    },
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const auth = useAuth();
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const { data, isPending } = useAdminPIN();

    useEffect(() => {
        if (data !== undefined) {
            setIsAdminAuth(data);
        }
    }, [data]);

    useEffect(() => {
        if (auth.user?.role !== "ADMIN") {
            router.navigate({ to: "/chat" });
        }
    }, [auth.user?.role]);

    if (isPending) {
        return <Loading />;
    }

    if (auth.user?.role !== "ADMIN") {
        return <Loading />;
    }

    return (
        <DashboardContextProvider props={{ isAdminAuth, setIsAdminAuth }}>
            <div className="appear flex h-full relative">
                {!isPending && !isAdminAuth ? <PINPad /> : null}
                <div
                    className={`flex h-full w-full ${isAdminAuth ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-300 ease-in-out`}
                >
                    <div className="h-full min-w-max">
                        <DashboardSidebar />
                    </div>
                    {isAdminAuth ? (
                        <div className="flex-1 flex flex-col h-full bg-zinc-900 overflow-auto p-8">
                            <Outlet />
                        </div>
                    ) : null}
                </div>
            </div>
        </DashboardContextProvider>
    );
}
