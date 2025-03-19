import ChatInput from "./chat/ChatInput";
import Messages from "./chat/Messages";
import { useChatMessages } from "@queries/getChatMessages";
import { useGenerateAIAnswer } from "@mutations/generateAIAnswer";

const Chat = ({ chatId }: { chatId: string }) => {
    const { data, isPending } = useChatMessages(chatId);
    const generateAnswer = useGenerateAIAnswer();

    return (
        <div className="flex flex-col flex-1 w-full overflow-hidden">
            <Messages
                messages={data.messages}
                isPending={isPending}
                isGeneratingAnswer={generateAnswer.isPending}
            />
            <ChatInput chatId={chatId} generateAnswer={generateAnswer} />
        </div>
    );
};

export default Chat;
