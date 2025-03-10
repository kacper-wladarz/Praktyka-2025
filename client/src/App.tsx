import { createContext, useEffect, useMemo } from "react";
import useAuth from "./hooks/useAuth";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Loading from "./assets/Loading";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

export const GlobalContext = createContext<GlobalContextInterface>(
    {} as GlobalContextInterface
);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const App = () => {
    const { JWT, setJWT, isPending, userData } = useAuth();
    const queryClient = useQueryClient();
    const reqAuth = useMemo(() => {
        if (JWT) return { Authorization: "Bearer " + JWT };
        return { Authorization: "Bearer " };
    }, [JWT]);

    useEffect(() => {
        if (JWT) {
            Cookies.set("jwt", JWT, { expires: 1 });
        } else {
            Cookies.remove("jwt");
        }
        queryClient.invalidateQueries({ queryKey: ["auth"] });
    }, [JWT]);

    if (isPending) {
        return <Loading />;
    }

    return (
        <GlobalContext.Provider value={{ JWT, setJWT, userData, reqAuth }}>
            <RouterProvider router={router} />
        </GlobalContext.Provider>
    );
};
export default App;
