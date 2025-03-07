import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios, { AxiosError } from "axios";
import { API_URL } from "../../../main";
import { useContext } from "react";
import { GlobalContext } from "../../../App";
import { FoldersAndChatsContext } from "../../../components/chat/SideBar";

export const Route = createFileRoute("/_chatLayout/chat/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();
    const { setError } = useContext(FoldersAndChatsContext);
    const { reqAuth } = useContext(GlobalContext);
    const { data } = useQuery({
        queryKey: ["chat", id],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/chats/${id}`, { headers: { ...reqAuth } })
                .then((res) => res.data)
                .catch((err) => {
                    if (err instanceof AxiosError) {
                        err.response && setError(err.response.data.message);
                    } else {
                        setError("Wystąpił błąd podczas logowania");
                    }
                }),
        retry: 0,
    });

    console.log(data);

    return (
        <div className="appear flex-1 flex flex-col bg-zinc-900">
            <div>{id}</div>
        </div>
    );
}
