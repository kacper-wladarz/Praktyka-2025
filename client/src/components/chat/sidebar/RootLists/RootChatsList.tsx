import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../../../../App";
import { API_URL } from "../../../../main";
import React from "react";
import RootChat from "./RootChat";

const RootChatsList = () => {
    const { reqAuth } = useContext(GlobalContext);

    const { data } = useQuery({
        queryKey: ["root-chats"],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/chats/root`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
        retry: 0,
    });

    return (
        <React.Fragment>
            {data &&
                data.chats.map((chat: Chat) => (
                    <RootChat key={`root-folder-${chat.id}`} chat={chat} />
                ))}
        </React.Fragment>
    );
};

export default RootChatsList;
