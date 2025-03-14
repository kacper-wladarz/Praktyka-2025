import React, { useContext } from "react";
import { getRootChats } from "../../../../api/queries/getRootChats";
import { FoldersAndChatsContext } from "../../SideBar";
import Chat from "./Chat";

const ChatsList = () => {
    const { setError } = useContext(FoldersAndChatsContext);
    const { data, error } = getRootChats();

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
