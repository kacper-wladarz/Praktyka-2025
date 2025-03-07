import { useState } from "react";
import FolderArrow from "../../../FolderArrow";

const RootFolder = ({ folder }: { folder: Folder }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="w-full">
            <button
                className="w-full flex items-center gap-1 cursor-pointer px-4 hover:bg-zinc-900 transition-[background] duration-200 ease-in-out"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <FolderArrow isOpen={isOpen} />
                <span>{folder.name}</span>
            </button>
        </div>
    );
};

export default RootFolder;
