import { getChatMessages } from "../../../api/queries/getChatMessages";
import Loading from "../../../assets/Loading";
import Message from "./Message";

const Messages = ({ chatId }: { chatId: string }) => {
    const { data: chatData, isPending } = getChatMessages(chatId);

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="max-h-full h-full overflow-y-scroll w-full flex flex-col gap-24">
            {chatData &&
                chatData.messages.map((message: Message) => (
                    <Message key={`message-${message.id}`} message={message} />
                ))}
        </div>
    );
};

export default Messages;
