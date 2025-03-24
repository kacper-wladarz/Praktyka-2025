import { useEffect, useState } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { GlobalContextProvider } from "@contexts/GlobalContext";
import { useAuth } from "@contexts/AuthContext";
import { useExpirePIN } from "./api/mutations/expirePin";

export const router = createRouter({
    routeTree,
    context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
    interface HistoryState {
        allow?: boolean;
        from?: string;
        message?: string;
    }
}

const App = () => {
    const [isConfirmWindowOpen, setIsConfirmWindowOpen] =
        useState<boolean>(false);
    const [structureToDelete, setStructureToDelete] =
        useState<StructureToDelete>({} as StructureToDelete);
    const [chatId, setChatId] = useState<string | null>(null);
    const auth = useAuth();
    const expirePIN = useExpirePIN();

    useEffect(() => {
        const subscribe = router.subscribe("onResolved", (route) => {
            if (
                route.fromLocation?.pathname.startsWith("/dashboard") &&
                !route.toLocation.pathname.startsWith("/dashboard")
            ) {
                expirePIN.mutate();
            }
        });
        return subscribe;
    }, []);

    return (
        <GlobalContextProvider
            props={{
                isConfirmWindowOpen,
                setIsConfirmWindowOpen,
                structureToDelete,
                setStructureToDelete,
                chatId,
                setChatId,
            }}
        >
            <RouterProvider router={router} context={{ auth }} />
        </GlobalContextProvider>
    );
};
export default App;
