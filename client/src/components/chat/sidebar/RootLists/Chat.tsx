import { useDraggable } from "@dnd-kit/core";
import { router } from "@/App";
import FolderArrow from "@assets/FolderArrow";
import BinIcon from "@assets/BinIcon";
import { useGlobalContext } from "@contexts/GlobalContext";
import { useSidebarContext } from "@contexts/SidebarContext";
import { useUpdateChat } from "@mutations/lastOpenedChat";

const Chat = ({ chat }: { chat: Chat }) => {
    const update = useUpdateChat();
    const { setChatId, setIsConfirmWindowOpen, chatId } = useGlobalContext();
    const { setIsSidebarOpen } = useSidebarContext();

    const handleUpdate = (id: string) => {
        update.mutate(id, {
            onSuccess: (res) => {
                setChatId(res.chatId);
                setIsSidebarOpen(false);
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

    const handleDeleteChat = (id: string, name: string) => {
        setIsConfirmWindowOpen(true);
        router.navigate({
            to: "/chat/$id",
            params: { id: chatId || "" },
            search: { structureId: id, name, type: "CHAT" },
        });
    };

    return (
        <div
            className={`w-full flex justify-between bg-zinc-950 hover:bg-zinc-800 transition-all duration-200 ease-in-out`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <button
                className={`w-full flex overflow-hidden cursor-grab items-center gap-1 px-2 font-semilight`}
                onClick={() => handleUpdate(chat.id)}
            >
                <FolderArrow isOpen={false} isVisible={false} />
                <span className="py-[2px] whitespace-nowrap">{chat.name}</span>
            </button>
            <div className="flex gap-1 px-2">
                <button
                    className="cursor-pointer hover:bg-[rgba(255,255,255,0.2)] p-[2px] rounded-full transition-[background-color] duration-200 ease-in-out"
                    onClick={() => handleDeleteChat(chat.id, chat.name)}
                >
                    <BinIcon />
                </button>
            </div>
        </div>
    );
};

export default Chat;
