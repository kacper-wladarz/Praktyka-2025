import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import NotFound from "../components/NotFound";
import Confirm from "../components/Confirm";
import DeleteWindow from "../components/chat/DeleteWindow";

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound />,
    component: () => {
        return (
            <>
                <Confirm>
                    <DeleteWindow />
                </Confirm>
                <Navbar />
                <hr className="border-white" />
                <div className="appear w-full flex-1 flex flex-col text-sky-200">
                    <Outlet />
                </div>
            </>
        );
    },
});
