import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../App";

export const Route = createRootRoute({
    component: () => {
        const navigate = useNavigate();
        const { JWT, setJWT } = useContext(GlobalContext);

        useEffect(() => {
            if (JWT) {
                localStorage.setItem("jwt", JWT);
            } else {
                localStorage.removeItem("jwt");
            }
        }, [JWT]);

        return (
            <>
                <Navbar />
                <hr className="border-white" />
                <div className="appear w-full flex-1 flex flex-col text-sky-200">
                    {JWT ? "zalogowany" : "wylogowany"}
                    <button
                        onClick={() => {
                            setJWT(null);
                            navigate({ to: "/logout", state: { allow: true } });
                        }}
                    >
                        Wyloguj
                    </button>
                    <Outlet />
                </div>
                <TanStackRouterDevtools />
            </>
        );
    },
});
