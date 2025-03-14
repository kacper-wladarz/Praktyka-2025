import React, { useContext, useEffect, useState } from "react";
import { NewStructuresContext } from "./Folder";
import { createFolder } from "../../../../api/mutations/createFolder";
import { FoldersAndChatsContext } from "../../SideBar";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { UUID } from "crypto";
import { InputsContext } from "../FoldersAndChats";
import RightArrow from "../../../../assets/RightArrow";

interface Props {
    folderId: string;
    newFolderId: UUID;
}

const NewInsideFolder = ({ folderId, newFolderId }: Props) => {
    const { setIsOpen } = useContext(NewStructuresContext);
    const [newFolder, setNewFolder] = useState<string>("");
    const { setError } = useContext(FoldersAndChatsContext);
    const { openedInputId, setOpenedInputId } = useContext(InputsContext);
    const createNewFolder = createFolder();
    const queryClient = useQueryClient();

    const handleCreateKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.code === "Enter") {
            create();
        }
    };

    const create = () => {
        createNewFolder.mutate(
            { newFolder, id: folderId },
            {
                onSuccess: () => {
                    setIsOpen(true);
                    setOpenedInputId(null);
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
    };

    useEffect(() => {
        if (openedInputId === newFolderId) {
            const element = document.getElementById(
                openedInputId
            ) as HTMLInputElement;
            if (element) element.focus();
        }
    }, [openedInputId]);

    return (
        <div
            className={`auto_height bg-zinc-900 flex items-stretch ${openedInputId === newFolderId ? "h-auto opacity-100" : "h-0 ocity-0"} overflow-hidden transition-all duration-300 ease-in-out`}
        >
            <input
                className="w-full px-2 py-1 text-white font-semilight outline-none border border-[rgba(255,255,255,0.5)]"
                type="text"
                placeholder="Nazwa folderu"
                value={newFolder}
                onChange={(event) => setNewFolder(event.target.value)}
                onKeyDown={(event) => handleCreateKeyDown(event)}
                id={newFolderId}
            />
            <button
                className="px-1 border border-l-0 border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-zinc-800 transition-[background] duration-300 ease-in-out"
                onClick={() => create()}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewInsideFolder;
