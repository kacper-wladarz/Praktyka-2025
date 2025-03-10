import { router } from "../../../../App";
import { updateChat } from "../../../../api/mutations/lastOpenedChat";
import FolderArrow from "../../../../assets/FolderArrow";

const Chat = ({ chat }: { chat: Chat }) => {
    const update = updateChat();

    const handleUpdate = (id: string) => {
        update.mutate(id, {
            onSuccess: (res) => {
                router.navigate({
                    to: "/chat/$id",
                    params: { id: res.chatId },
                });
            },
        });
    };

    return (
        <div className="w-full" key={`root-folder-${chat.id}`}>
            <button
                className="w-full flex items-center gap-1 cursor-pointer px-2 font-semilight hover:bg-zinc-800 transition-[background] duration-200 ease-in-out"
                onClick={() => handleUpdate(chat.id)}
            >
                <FolderArrow isOpen={false} isVisible={false} />
                <span className="py-[2px]">{chat.name}</span>
            </button>
        </div>
    );
};

export default Chat;
