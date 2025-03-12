import { useDraggable } from "@dnd-kit/core";
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

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: chat.id,
        data: {
            name: chat.name,
            type: "CHAT",
        },
    });

    const style = transform
        ? {
              transform: `translate(${transform.x}px, ${transform.y}px)`,
          }
        : undefined;

    return (
        <div
            className={`w-full`}
            key={`root-folder-${chat.id}`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <button
                className={`w-full flex bg-zinc-950 overflow-hidden cursor-grab items-center gap-1 px-2 font-semilight hover:bg-zinc-800 transition-all duration-200 ease-in-out`}
                onClick={() => handleUpdate(chat.id)}
            >
                <FolderArrow isOpen={false} isVisible={false} />
                <span className="py-[2px] whitespace-nowrap">{chat.name}</span>
            </button>
        </div>
    );
};

export default Chat;
