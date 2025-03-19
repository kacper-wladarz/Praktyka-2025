import React from "react";
import Chat from "./Chat";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useRootChats } from "@queries/getRootChats";

const ChatsList = () => {
    const { setError } = useFoldersAndChatsContext();
    const { data, error } = useRootChats();

    if (error) setError(error.message);

    return (
        <React.Fragment>
            {data &&
                data.chats.map((chat: Chat) => (
                    <Chat key={`root-chat-${chat.id}`} chat={chat} />
                ))}
        </React.Fragment>
    );
};

export default ChatsList;
