import { useState } from "react";
import RootChat from "./Chat";
import NewInsideFolder from "./NewInsideFolder";
import NewInsideChat from "./NewInsideChat";
import FolderHeader from "./FolderHeader";
import { useDraggable } from "@dnd-kit/core";
import { NewStructuresContextProvider } from "@contexts/NewStructuresContext";
import { useFolderStructures } from "@queries/getFolderStructures";

interface Props {
    folder: Folder;
}

const Folder = ({ folder }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data } = useFolderStructures({ id: folder.id, isOpen });
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: folder.id,
            data: {
                name: folder.name,
                type: "FOLDER",
            },
        });
    const [newFolderId] = useState(() => crypto.randomUUID());
    const [newChatId] = useState(() => crypto.randomUUID());

    const style: React.CSSProperties = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
    };

    return (
        <div
            className={`w-full flex flex-col overflow-hidden`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <NewStructuresContextProvider
                props={{
                    isOpen,
                    setIsOpen,
                }}
            >
                <FolderHeader
                    name={folder.name}
                    id={folder.id}
                    isDragging={isDragging}
                    newFolderId={newFolderId}
                    newChatId={newChatId}
                />
                <NewInsideFolder
                    folderId={folder.id}
                    newFolderId={newFolderId}
                />
                <NewInsideChat folderId={folder.id} newChatId={newChatId} />
            </NewStructuresContextProvider>
            <div
                className={`ml-4 auto_height overflow-hidden ${isOpen ? (isDragging ? "h-0 w-0" : "h-auto w-auto opacity-100 pointer-events-auto transition-all duration-300 ease-in-out") : "h-0 w-0 delay-300 opacity-0 pointer-events-none transition-all duration-300 ease-in-out"}`}
            >
                <div
                    className={`w-full flex flex-col gap-1 ${data && data.length > 0 ? "mt-1" : "mt-0"} transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0 delay-200" : "-translate-x-full"}`}
                >
                    {data &&
                        data.list.map((item: Folder | Chat) => (
                            <div
                                key={`structure-${item.id}`}
                                className={`w-full bg-clip-text`}
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
