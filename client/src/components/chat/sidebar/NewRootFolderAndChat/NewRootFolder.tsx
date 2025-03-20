import { AxiosError } from "axios";
import React, { RefObject, useEffect, useState } from "react";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useCreateRootFolder } from "@mutations/createRootFolder";
import RightArrow from "@assets/RightArrow";
import { queryClient } from "@/main";
import { useTranslation } from "react-i18next";

const NewRootFolder = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLInputElement | null>;
}) => {
    const { isNewFolder, setIsNewFolder, setError } =
        useFoldersAndChatsContext();
    const [newFolder, setNewFolder] = useState<string>("");
    const create = useCreateRootFolder();
    const { t } = useTranslation();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            createFolder();
        }
    };

    const createFolder = () => {
        create.mutate(newFolder, {
            onSuccess: (res) => {
                queryClient.setQueryData(
                    ["folders", "root"],
                    ({ folders }: { folders: FolderItem[] }) => {
                        if (!folders) return { folders: [...res.data.folder] };
                        return {
                            folders: [res.data.folder, ...folders],
                        };
                    }
                );
            },
            onError: (error) => {
                console.log(error);
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
    };

    useEffect(() => {
        if (isNewFolder && inputRef.current) {
            inputRef.current.focus();
        }

        if (!isNewFolder) setNewFolder("");
    }, [isNewFolder]);

    return (
        <div
            className={`auto_height ${isNewFolder ? "h-auto opacity-100" : "h-0 opacity-0"} flex items-stretch bg-zinc-900 transition-[height,opacity] duration-300 ease-in-out overflow-hidden`}
        >
            <input
                placeholder={t("sidebar.newFolderPlaceholder")}
                id="new_folder_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none"
                ref={inputRef}
                type="text"
                value={newFolder}
                autoComplete="off"
                onKeyDown={(event) => handleKeyDown(event)}
                onChange={(event) => setNewFolder(event.target.value)}
            />
            <button
                className="px-1 border border-l-0 border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-zinc-800 transition-[background] duration-300 ease-in-out"
                onClick={() => createFolder()}
                disabled={create.isPending}
            >
                <RightArrow />
            </button>
        </div>
    );
};

export default NewRootFolder;
