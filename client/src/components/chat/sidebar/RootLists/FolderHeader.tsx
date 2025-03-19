import FolderArrow from "@assets/FolderArrow";
import NewChatIcon from "@assets/NewChatIcon";
import NewFolderIcon from "@assets/NewFolderIcon";
import { useDroppable } from "@dnd-kit/core";
import BinIcon from "@assets/BinIcon";
import { router } from "@/App";
import { UUID } from "crypto";
import { useGlobalContext } from "@contexts/GlobalContext";
import { useNewStructuresContext } from "@contexts/NewStructuresContext";
import { useInputsContext } from "@contexts/InputsContext";

interface Props {
    id: string;
    name: string;
    isDragging: boolean;
    newFolderId: UUID;
    newChatId: UUID;
}

const FolderHeader = ({
    name,
    id,
    isDragging,
    newFolderId,
    newChatId,
}: Props) => {
    const { isOpen, setIsOpen } = useNewStructuresContext();
    const { setIsConfirmWindowOpen, chatId } = useGlobalContext();
    const { setOpenedInputId, openedInputId } = useInputsContext();
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const handleDeleteFolder = (id: string, name: string) => {
        setIsConfirmWindowOpen(true);
        router.navigate({
            to: "/chat/$id",
            params: { id: chatId || "" },
            search: { structureId: id, name, type: "FOLDER" },
        });
    };

    return (
        <div
            ref={setNodeRef}
            className={`w-full flex items-center cursor-grab justify-between transition-[background] duration-300 ease-in-out ${isOver ? "bg-zinc-700" : "bg-zinc-950"} ${isDragging ? "pointer-events-none bg-zinc-950" : "hover:bg-zinc-800 pointer-events-auto"}`}
        >
            <button
                className="w-full flex items-center gap-1 px-2 cursor-grab  "
                onClick={() => setIsOpen((prev: boolean) => !prev)}
            >
                <FolderArrow isOpen={isOpen} />
                <span className="py-[2px] whitespace-nowrap">{name}</span>
            </button>
            <div className="h-full flex items-stretch gap-1 px-2 cursor-grab">
                <button
                    className="new_button not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] p-[6px] rounded-full transition-[background-color] duration-200 ease-in-out"
                    onClick={() => setOpenedInputId(newFolderId)}
                    disabled={openedInputId === newFolderId}
                >
                    <NewFolderIcon />
                </button>
                <button
                    className="new_button not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] p-[6px] rounded-full"
                    onClick={() => setOpenedInputId(newChatId)}
                    disabled={openedInputId === newChatId}
                >
                    <NewChatIcon />
                </button>
                <div className="flex-1 w-[1px] flex items-center">
                    <div className="h-[60%] bg-white opacity-40 w-full"></div>
                </div>
                <button
                    className="cursor-pointer hover:bg-[rgba(255,255,255,0.2)] p-[2px] rounded-full transition-[background-color] duration-200 ease-in-out"
                    onClick={() => handleDeleteFolder(id, name)}
                >
                    <BinIcon />
                </button>
            </div>
        </div>
    );
};

export default FolderHeader;
