import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import React, { useContext, useEffect } from "react";
import SideBar from "../components/chat/SideBar";
import { GlobalContext } from "../App";

export const Route = createFileRoute("/_chatLayout")({
    component: RouteComponent,
});

function RouteComponent() {
    const { JWT } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!JWT) {
            navigate({ to: "/" });
        }
    }, [JWT]);

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
