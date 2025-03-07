import { createFileRoute, Outlet } from "@tanstack/react-router";
import React, { useContext } from "react";
import SideBar from "../components/chat/SideBar";
import { GlobalContext } from "../App";

export const Route = createFileRoute("/_chatLayout")({
    component: RouteComponent,
});

function RouteComponent() {
    const { JWT } = useContext(GlobalContext);

    return (
        <React.Fragment>
            {JWT && (
                <div className="appear w-full flex-1 flex">
                    <SideBar />
                    <Outlet />
                </div>
            )}
        </React.Fragment>
    );
}
