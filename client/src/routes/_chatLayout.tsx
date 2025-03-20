import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import SideBar from "@components/chat/SideBar";
import { SidebarContextProvider } from "@contexts/SidebarContext";

export const Route = createFileRoute("/_chatLayout")({
    beforeLoad: ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: "/" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <SidebarContextProvider props={{ isSidebarOpen, setIsSidebarOpen }}>
            <div className="appear w-full flex-1 flex relative">
                <SideBar />
                <Outlet />
            </div>
        </SidebarContextProvider>
    );
}
