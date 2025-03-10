import { useContext } from "react";
import FolderArrow from "../../../../assets/FolderArrow";
import NewChatIcon from "../../../../assets/NewChatIcon";
import NewFolderIcon from "../../../../assets/NewFolderIcon";
import { NewStructuresContext } from "./Folder";

const FolderHeader = ({ name }: { name: string }) => {
    const {
        isOpen,
        setIsOpen,
        isNewFolderOpen,
        isNewChatOpen,
        setIsNewFolderOpen,
        setIsNewChatOpen,
    } = useContext(NewStructuresContext);

    return (
        <div className="w-full flex items-center justify-between hover:bg-zinc-800 transition-[background] duration-200 ease-in-out">
            <button
                className="w-full flex items-center gap-1 cursor-pointer px-2"
                onClick={() => setIsOpen((prev: boolean) => !prev)}
            >
                <FolderArrow isOpen={isOpen} />
                <span className="py-[2px] whitespace-nowrap">{name}</span>
            </button>
            <div className="flex items-center gap-1 px-2">
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
