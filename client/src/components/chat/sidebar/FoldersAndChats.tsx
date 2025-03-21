import { useEffect, useRef, useState } from "react";
import NewRootFolder from "./NewRootFolderAndChat/NewRootFolder";
import NewRootChat from "./NewRootFolderAndChat/NewRootChat";
import FoldersList from "./RootLists/FoldersList";
import ChatsList from "./RootLists/ChatsList";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import RootArea from "./RootLists/RootArea";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { InputsContextProvider } from "@contexts/InputsContext";
import { useUpdateParentId } from "@mutations/updateParentId";
import { queryClient } from "@/main";
import OpenArrow from "@/assets/OpenArrow";

const FoldersAndChats = () => {
    const newRootFolderRef = useRef<HTMLDivElement>(null);
    const newRootChatRef = useRef<HTMLDivElement>(null);
    const { setIsNewFolder, setIsNewChat } = useFoldersAndChatsContext();
    const [openedInputId, setOpenedInputId] = useState<string | null>(null);
    const [draggedElement, setDraggedElement] = useState({
        id: "",
        type: "",
        name: "",
    });
    const updateParent = useUpdateParentId();

    useEffect(() => {
        const handleMouseDownOutside = (event: MouseEvent) => {
            if (
                newRootFolderRef.current &&
                event.target instanceof Node &&
                !newRootFolderRef.current.contains(event.target) &&
                newRootChatRef.current &&
                event.target instanceof Node &&
                !newRootChatRef.current.contains(event.target)
            ) {
                setIsNewFolder(false);
                setIsNewChat(false);
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                target.id !== openedInputId &&
                typeof target.className === "string" &&
                !target.className.includes("new_button")
            ) {
                setOpenedInputId(null);
            }
        };

        document.addEventListener("mousedown", handleMouseDownOutside);
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleMouseDownOutside);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openedInputId]);

    const handleDragStart = ({ active }: DragStartEvent) => {
        setDraggedElement({
            id: active.id as string,
            type: active.data.current?.type as string,
            name: active.data.current?.name as string,
        });
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;
        if (active.data.current) {
            const structureId = active.id as string;
            const typeOfStructure = active.data.current.type;
            const parentId = over.id as string;
            if (parentId !== structureId) {
                updateParent.mutate(
                    {
                        structureId,
                        parentId,
                        type: typeOfStructure,
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ["folders"],
                                exact: false,
                            });
                            queryClient.invalidateQueries({
                                queryKey: ["chats"],
                                exact: false,
                            });
                        },
                    }
                );
            }
        }
    };

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });
    const sensors = useSensors(mouseSensor);

    return (
        <div className="flex flex-col">
            <hr className="border-white opacity-50" />
            <NewRootFolder inputRef={newRootFolderRef} />
            <NewRootChat inputRef={newRootChatRef} />
            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <RootArea />
                <div className={`flex flex-col text-[16px] gap-1`}>
                    <InputsContextProvider
                        props={{
                            openedInputId,
                            setOpenedInputId,
                        }}
                    >
                        <FoldersList />
                        <ChatsList />
                    </InputsContextProvider>
                    <DragOverlay>
                        <div className="w-full flex items-center px-2 py-1 bg-zinc-700 cursor-grabbing">
                            <OpenArrow
                                isOpen={false}
                                isVisible={draggedElement.type === "FOLDER"}
                            />
                            <span className="whitespace-nowrap">
                                {draggedElement.name}
                            </span>
                        </div>
                    </DragOverlay>
                </div>
            </DndContext>
        </div>
    );
};

export default FoldersAndChats;
