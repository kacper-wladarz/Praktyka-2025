import { useContext } from "react";
import FolderArrow from "../../../../assets/FolderArrow";
import NewChatIcon from "../../../../assets/NewChatIcon";
import NewFolderIcon from "../../../../assets/NewFolderIcon";
import { NewStructuresContext } from "./Folder";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    id: string;
    name: string;
    isDragging: boolean;
}

const FolderHeader = ({ name, id, isDragging }: Props) => {
    const {
        isOpen,
        setIsOpen,
        isNewFolderOpen,
        isNewChatOpen,
        setIsNewFolderOpen,
        setIsNewChatOpen,
    } = useContext(NewStructuresContext);

    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

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
            <div className="flex items-center gap-1 px-2 cursor-grab">
                <button
                    className="not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] p-[6px] rounded-full transition-[background-color] duration-200 ease-in-out"
                    onClick={() => setIsNewFolderOpen(true)}
                    disabled={isNewFolderOpen}
                >
                    <NewFolderIcon />
                </button>
                <button
                    className="not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] p-[6px] rounded-full"
                    onClick={() => setIsNewChatOpen(true)}
                    disabled={isNewChatOpen}
                >
                    <NewChatIcon />
                </button>
            </div>
        </div>
    );
};

export default FolderHeader;
