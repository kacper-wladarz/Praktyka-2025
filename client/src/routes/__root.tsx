import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
    component: () => (
        <>
            <Navbar />
            <hr className="border-white" />
            <div className="appear w-full flex-1 flex flex-col text-sky-200">
                <Outlet />
            </div>
            <TanStackRouterDevtools />
        </>
    ),
});
