import { useContext, useEffect, useRef } from "react";
import { FoldersAndChatsContext } from "../SideBar";
import NewRootFolder from "./NewRootFolderAndChat/NewRootFolder";
import NewRootChat from "./NewRootFolderAndChat/NewRootChat";
import RootFoldersList from "./RootLists/FoldersList";
import RootChatsList from "./RootLists/ChatsList";

const FoldersAndChats = () => {
    const newRootFolderRef = useRef<HTMLInputElement>(null);
    const newRootChatRef = useRef<HTMLInputElement>(null);
    const { setIsNewFolder, setIsNewChat } = useContext(FoldersAndChatsContext);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col text-[16px]">
            <hr className="border-white opacity-50" />
            <NewRootFolder inputRef={newRootFolderRef} />
            <NewRootChat inputRef={newRootChatRef} />
            <RootFoldersList />
            <RootChatsList />
        </div>
    );
};

export default FoldersAndChats;
