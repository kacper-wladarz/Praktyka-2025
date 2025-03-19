import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { UUID } from "crypto";
import RightArrow from "@assets/RightArrow";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useNewStructuresContext } from "@contexts/NewStructuresContext";
import { useInputsContext } from "@contexts/InputsContext";
import { useCreateFolder } from "@mutations/createFolder";
import { queryClient } from "@/main";

interface Props {
    folderId: string;
    newFolderId: UUID;
}

const NewInsideFolder = ({ folderId, newFolderId }: Props) => {
    const { setIsOpen } = useNewStructuresContext();
    const [newFolder, setNewFolder] = useState<string>("");
    const { setError } = useFoldersAndChatsContext();
    const { openedInputId, setOpenedInputId } = useInputsContext();
    const createNewFolder = useCreateFolder();

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
                onSuccess: (res) => {
                    setIsOpen(true);
                    setOpenedInputId(null);
                    setNewFolder("");
                    queryClient.setQueryData(
                        ["folders", folderId],
                        ({ list: data }: { list: FolderItem[] }) => {
                            if (!data)
                                return { list: [{ ...res.data.folder }] };
                            return { list: [res.data.folder, ...data] };
                        }
                    );
                },
                onError: (err) => {
                    if (err instanceof AxiosError) {
                        err.response && setError(err.response.data.message);
                    } else {
                        setError("Wystąpił błąd podczas tworzenia czatu");
                    }
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
            className={`auto_height bg-zinc-900 flex items-stretch ${openedInputId === newFolderId ? "h-auto opacity-100" : "h-0 opacity-0"} overflow-hidden transition-all duration-300 ease-in-out`}
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
                disabled={createNewFolder.isPending}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewInsideFolder;
