import React, { useContext, useEffect, useState } from "react";
import { NewStructuresContext } from "./Folder";
import { createFolder } from "../../../../api/mutations/createFolder";
import { FoldersAndChatsContext } from "../../SideBar";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

const NewInsideFolder = ({ folderId }: { folderId: string }) => {
    const { setIsOpen, isNewFolderOpen, setIsNewFolderOpen, setIsNewChatOpen } =
        useContext(NewStructuresContext);
    const [newFolder, setNewFolder] = useState<string>("");
    const { setError } = useContext(FoldersAndChatsContext);
    const createNewFolder = createFolder();
    const queryClient = useQueryClient();

    const handleCreateFolder = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.code === "Enter") {
            createNewFolder.mutate(
                { newFolder, id: folderId },
                {
                    onSuccess: () => {
                        setIsOpen(true);
                        setIsNewFolderOpen(false);
                        setNewFolder("");
                    },
                    onError: (err) => {
                        if (err instanceof AxiosError) {
                            err.response && setError(err.response.data.message);
                        } else {
                            setError("Wystąpił błąd podczas tworzenia czatu");
                        }
                    },
                    onSettled: () => {
                        queryClient.invalidateQueries({
                            queryKey: ["structures-list"],
                        });
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (isNewFolderOpen) setIsNewChatOpen(false);
    }, [isNewFolderOpen]);

    return (
        <div
            className={`auto_height ${isNewFolderOpen ? "h-auto" : "h-0"} overflow-hidden transition-[height] duration-300 ease-in-out`}
        >
            <input
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                type="text"
                placeholder="Nazwa folderu"
                value={newFolder}
                onChange={(event) => setNewFolder(event.target.value)}
                onKeyDown={(event) => handleCreateFolder(event)}
            />
        </div>
    );
};

export default NewInsideFolder;
