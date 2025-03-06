import { createContext, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import Loading from "./components/Loading";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

export const GlobalContext = createContext<GlobalContextInterface>(
    {} as GlobalContextInterface
);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const App = () => {
    const { JWT, setJWT, isPending, userData } = useAuth();
    const queryClient = useQueryClient();

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
        <GlobalContext.Provider value={{ JWT, setJWT, userData }}>
            <RouterProvider router={router} />
        </GlobalContext.Provider>
    );
};
export default App;
