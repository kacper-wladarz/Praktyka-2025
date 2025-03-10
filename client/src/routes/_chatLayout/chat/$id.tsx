import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getSingleChat } from "../../../api/queries/getSingleChat";
import Loading from "../../../assets/Loading";
import { AxiosError } from "axios";
import { updateChat } from "../../../api/mutations/lastOpenedChat";
import { useEffect } from "react";
import Chat from "../../../components/chat/Chat";

export const Route = createFileRoute("/_chatLayout/chat/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { id } = Route.useParams();
    const { data, error, isPending } = getSingleChat(id);
    const update = updateChat();

    useEffect(() => {
        if (!id) navigate({ to: "/chat" });
    }, [id]);

    if (isPending) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="w-full flex justify-center items-center">
                {error instanceof AxiosError && error.response
                    ? error.response.data.message
                    : "Wystąpił błąd"}
            </div>
        );
    }

    const handleClose = () => {
        update.mutate(null, {
            onSuccess: () => {
                navigate({ to: "/chat" });
            },
        });
    };

    return (
        <div className="appear flex-1 flex flex-col bg-zinc-900">
            <div className="w-full flex items-center justify-between text-extralight px-8 py-6 shadow-[0px_0px_8px_0px_rgb(0,0,0)]">
                <span className="text-4xl">{data.name}</span>
                <button
                    className="text-4xl cursor-pointer hover:bg-zinc-800 px-4 py-2 rounded-xl transition-[background] duration-300 ease-in-out"
                    onClick={() => handleClose()}
                >
                    Zamknij
                </button>
            </div>
            <Chat chatId={id} />
        </div>
    );
}
