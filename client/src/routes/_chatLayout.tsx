import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import SideBar from "../components/chat/SideBar";
import { GlobalContext } from "../App";

export const Route = createFileRoute("/_chatLayout")({
    component: RouteComponent,
});

export const SidebarContext = createContext<SidebarContext>(
    {} as SidebarContext
);

function RouteComponent() {
    const { JWT } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!JWT) {
            navigate({ to: "/" });
        }
    }, [JWT]);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            {JWT && (
                <div className="appear w-full flex-1 flex relative">
                    <SideBar />
                    <Outlet />
                </div>
            )}
        </SidebarContext.Provider>
    );
}
