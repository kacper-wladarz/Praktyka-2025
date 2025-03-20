import { useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SendIcon from "@assets/SendIcon";
import { useCreateMessage } from "@mutations/createMessage";
import { queryClient } from "@/main";
import { useTranslation } from "react-i18next";

interface Props {
    chatId: string;
    generateAnswer: UseMutationResult<
        AxiosResponse<any, any>,
        Error,
        { chatId: string; messageId: string },
        unknown
    >;
}

const ChatInput = ({ chatId, generateAnswer }: Props) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const createMessageMutation = useCreateMessage();
    const { t } = useTranslation();

    const updateMessages = (id: string, body: string, userId: string) => {
        queryClient.setQueryData(
            ["chats", chatId, "messages"],
            ({ messages }: { messages: MessageData[] }) => {
                if (!messages)
                    return {
                        messages: [{ id, body, userId }],
                    };
                return {
                    messages: [...messages, { id, body, userId }],
                };
            }
        );
    };

    const sendMessage = () => {
        createMessageMutation.mutate(
            { chatId, question: newMessage },
            {
                onSettled: () => {
                    setNewMessage("");
                },
                onSuccess: (res) => {
                    const { id, body, userId } = res.data.message;
                    updateMessages(id, body, userId);
                    generateAnswer.mutate(
                        { chatId, messageId: id },
                        {
                            onSuccess: (res) => {
                                const { id, body, userId } = res.data.answer;
                                updateMessages(id, body, userId);
                            },
                        }
                    );
                },
            }
        );
    };

    return (
        <div
            className={`chat_input flex items-stretch pb-4 px-[3%] lg:px-[15%] gap-2 transition-[opacity] duration-200 ease-in-out ${generateAnswer.isPending ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
        >
            <div className="flex-1 p-4 bg-zinc-700 rounded-2xl flex shadow-[0px_0px_12px_-4px_rgb(0,0,0)]">
                <textarea
                    className="flex-1 text-white outline-none placeholder:text-gray-400 resize-none"
                    value={newMessage}
                    placeholder={t("chat.chatInputPlaceholder")}
                    rows={2}
                    onChange={(event) => setNewMessage(event.target.value)}
                    onKeyDown={(event) =>
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        sendMessage()
                    }
                />
            </div>
            <button
                className="cursor-pointer bg-zinc-700 p-4 rounded-2xl shadow-[0px_0px_12px_-4px_rgb(0,0,0)] hover:bg-zinc-600 transition-[background] duration-300 ease-in-out"
                disabled={createMessageMutation.isPending}
                onClick={() => sendMessage()}
            >
                <SendIcon />
            </button>
        </div>
    );
};

export default ChatInput;
