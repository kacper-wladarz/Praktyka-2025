import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Navbar from "@components/Navbar";
import Confirm from "@components/Confirm";
import DeleteWindow from "@components/chat/DeleteWindow";
import NotFound from "@components/NotFound";

interface RouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    notFoundComponent: () => <NotFound />,
    component: () => {
        return (
            <>
                <Confirm>
                    <DeleteWindow />
                </Confirm>
                <Navbar />
                <hr className="border-white opacity-50" />
                <div className="appear w-full flex-1 flex flex-col text-sky-200">
                    <Outlet />
                </div>
            </>
        );
    },
});
