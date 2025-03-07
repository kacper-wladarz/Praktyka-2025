import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { GlobalContext } from "../App";
import NotFound from "../components/NotFound";

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound />,
    component: () => {
        const navigate = useNavigate();
        const { setJWT } = useContext(GlobalContext);

        return (
            <>
                <Navbar />
                <hr className="border-white" />
                <div className="appear w-full flex-1 flex flex-col text-sky-200">
                    {/* <button
                        onClick={() => {
                            setJWT(null);
                            navigate({ to: "/logout", state: { allow: true } });
                        }}
                    >
                        Wyloguj
                    </button> */}
                    <Outlet />
                </div>
                <TanStackRouterDevtools />
            </>
        );
    },
});
