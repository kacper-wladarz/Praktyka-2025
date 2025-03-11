import { useEffect, useRef, useState } from "react";
import Loading from "../../../assets/Loading";
import Message from "./Message";

interface Props {
    messages: MessageData[];
    isPending: boolean;
    isGeneratingAnswer: boolean;
}

const Messages = ({ messages, isPending, isGeneratingAnswer }: Props) => {
    const [height, setHeight] = useState<string | null>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const headerHeight = document.querySelector(".header")?.clientHeight;
        const chatInputHeight =
            document.querySelector(".chat_input")?.clientHeight;
        const chatHeader = document.querySelector(".chat_header")?.clientHeight;
        if (headerHeight && chatInputHeight && chatHeader) {
            setHeight(
                `calc(100vh - ${headerHeight + chatInputHeight + chatHeader}px - 1px)`
            );
        }
    }, []);

    useEffect(() => {
        if (messagesRef.current && messages.length > 0) {
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    if (isPending || !height) {
        return <Loading />;
    }

    return (
        <div
            className="flex flex-col overflow-y-scroll px-[16%] py-8"
            ref={messagesRef}
            style={{
                height: height,
            }}
        >
            <div className="w-full flex flex-col gap-12 text-[14px]">
                {messages &&
                    messages.map((message: MessageData) => (
                        <Message
                            key={`message-${message.id}`}
                            message={message}
                        />
                    ))}
            </div>
            <div
                className={`auto_height flex flex-row gap-2 mr-0 transition-all duration-300 ease-in-out ${isGeneratingAnswer ? "h-auto opacity-100 mt-4" : "h-0 opacity-0 mt-0"}`}
            >
                <div className="w-3 h-3 rounded-full bg-blue-600 dot"></div>
                <div className="w-3 h-3 rounded-full bg-blue-600 dot"></div>
                <div className="w-3 h-3 rounded-full bg-blue-600 dot"></div>
            </div>
        </div>
    );
};

export default Messages;
