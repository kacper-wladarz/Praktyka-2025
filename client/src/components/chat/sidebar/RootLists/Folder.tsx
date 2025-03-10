import { createContext, useState } from "react";
import { getFolderStructures } from "../../../../api/queries/getFolderStructures";
import RootChat from "./Chat";
import NewInsideFolder from "./NewInsideFolder";
import NewInsideChat from "./NewInsideChat";
import FolderHeader from "./FolderHeader";

export interface NewStructuresProps {
    folderId: string;
}

export const NewStructuresContext = createContext<NewStructuresContext>(
    {} as NewStructuresContext
);

const Folder = ({ folder }: { folder: Folder }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isNewFolderOpen, setIsNewFolderOpen] = useState<boolean>(false);
    const [isNewChatOpen, setIsNewChatOpen] = useState<boolean>(false);
    const { data } = getFolderStructures({ id: folder.id, isOpen });

    return (
        <div className="w-full flex flex-col overflow-hidden">
            <NewStructuresContext.Provider
                value={{
                    isOpen,
                    setIsOpen,
                    isNewFolderOpen,
                    setIsNewFolderOpen,
                    isNewChatOpen,
                    setIsNewChatOpen,
                }}
            >
                <FolderHeader name={folder.name} />
                <NewInsideFolder folderId={folder.id} />
                <NewInsideChat folderId={folder.id} />
            </NewStructuresContext.Provider>
            <div
                className={`ml-3 auto_height overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "h-auto w-auto" : "h-0 w-0 delay-500"}`}
            >
                <div
                    className={`w-full transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0 delay-400" : "-translate-x-full"}`}
                >
                    {data &&
                        data.list.map((item: Folder | Chat) => (
                            <div
                                key={`structure-${item.id}`}
                                className={`w-full bg-clip-text overflow-hidden`}
                            >
                                {item.type === "FOLDER" && (
                                    <Folder folder={item as Folder} />
                                )}
                                {item.type === "CHAT" && (
                                    <RootChat chat={item as Chat} />
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Folder;
