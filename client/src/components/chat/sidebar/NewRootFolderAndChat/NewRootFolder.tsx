import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { RefObject, useContext, useEffect, useState } from "react";
import { FoldersAndChatsContext } from "../../SideBar";
import { createRootFolder } from "../../../../api/mutations/createRootFolder";

const NewRootFolder = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLInputElement | null>;
}) => {
    const { isNewFolder, setIsNewFolder, setError } = useContext(
        FoldersAndChatsContext
    );
    const queryClient = useQueryClient();
    const [newFolder, setNewFolder] = useState<string>("");
    const create = createRootFolder();

    const createFolder = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            create.mutate(newFolder, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["root-folders"],
                    });
                },
                onError: (error) => {
                    if (error instanceof AxiosError) {
                        error.response && setError(error.response.data.message);
                    } else {
                        setError("Wystąpił błąd");
                    }
                },
                onSettled: () => {
                    setNewFolder("");
                    setIsNewFolder(false);
                },
            });
        }
    };

    useEffect(() => {
        if (isNewFolder && inputRef.current) {
            inputRef.current.focus();
        }

        if (!isNewFolder) setNewFolder("");
    }, [isNewFolder]);

    return (
        <div
            className={`auto_height ${isNewFolder ? "h-auto opacity-100" : "h-0 opacity-0"} transition-[height,opacity] duration-300 ease-in-out overflow-hidden`}
        >
            <input
                placeholder="Nazwa folderu"
                id="new_folder_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                ref={inputRef}
                type="text"
                value={newFolder}
                autoComplete="off"
                onKeyDown={(event) => createFolder(event)}
                onChange={(event) => setNewFolder(event.target.value)}
            />
        </div>
    );
};

export default NewRootFolder;
