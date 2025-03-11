import { useEffect, useState } from "react";
import { getChatMessages } from "../../api/queries/getChatMessages";
import ChatInput from "./chat/ChatInput";
import Messages from "./chat/Messages";
import { generateAIAnswer } from "../../api/mutations/generateAIAnswer";

const Chat = ({ chatId }: { chatId: string }) => {
    const { data, isPending } = getChatMessages(chatId);
    const [messages, setMessages] = useState(data);
    const generateAnswer = generateAIAnswer();

    useEffect(() => {
        if (data && data.messages) {
            setMessages(data.messages);
        }
    }, [data]);

    return (
        <div className="flex flex-col flex-1">
            <Messages
                messages={messages}
                isPending={isPending}
                isGeneratingAnswer={generateAnswer.isPending}
            />
            <ChatInput
                chatId={chatId}
                setMessages={setMessages}
                generateAnswer={generateAnswer}
            />
        </div>
    );
};

export default Chat;
