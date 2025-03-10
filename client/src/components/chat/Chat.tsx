import { useState } from "react";
import { createMessage } from "../../api/mutations/createMessage";
import Messages from "./chat/Messages";

const Chat = ({ chatId }: { chatId: string }) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const createMessageMutation = createMessage();

    const sendMessage = () => {
        createMessageMutation.mutate({ chatId, question: newMessage });
    };

    // console.log(document.querySelector(".header")?.clientHeight);

    return (
        <div className="flex flex-col px-[15%] py-8 bg-yellow-300 flex-1">
            <Messages chatId={chatId} />
            <div className="flex items-center">
                <input
                    className="flex-1 bg-sky-200 text-black"
                    value={newMessage}
                    type="text"
                    onChange={(event) => setNewMessage(event.target.value)}
                />
                <button
                    className="cursor-pointer"
                    onClick={() => sendMessage()}
                >
                    Wyślij
                </button>
            </div>
        </div>
    );
};

export default Chat;
