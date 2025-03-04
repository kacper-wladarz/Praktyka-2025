import { createContext } from "react";
import useAuth from "./hooks/useAuth";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

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
    const { JWT, setJWT } = useAuth();

    return (
        <GlobalContext.Provider value={{ JWT, setJWT }}>
            <RouterProvider router={router} />
        </GlobalContext.Provider>
    );
};
export default App;
