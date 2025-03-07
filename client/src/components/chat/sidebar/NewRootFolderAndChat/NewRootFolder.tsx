import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { Ref, useContext, useState } from "react";
import { API_URL } from "../../../../main";
import { GlobalContext } from "../../../../App";
import { FoldersAndChatsContext } from "../../SideBar";

const NewRootFolder = ({ inputRef }: { inputRef: Ref<HTMLInputElement> }) => {
    const { reqAuth } = useContext(GlobalContext);
    const { isNewFolder, setIsNewFolder, setError } = useContext(
        FoldersAndChatsContext
    );
    const queryClient = useQueryClient();
    const [newFolder, setNewFolder] = useState<string>("");

    const folderMutation = useMutation({
        mutationFn: async () =>
            await axios
                .post(
                    `${API_URL}/folders/root`,
                    { name: newFolder },
                    { headers: { ...reqAuth } }
                )
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["root-folders"] });
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
    const createFolder = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter") {
            folderMutation.mutate();
        }
    };

    return (
        <div
            className={`auto_height ${isNewFolder ? "h-auto opacity-100" : "h-0 opacity-0"} transition-[height,opacity] duration-300 ease-in-out overflow-hidden`}
        >
            <input
                placeholder="Nazwa folderu"
                autoFocus
                id="new_folder_input"
                className="w-full px-4 py-1 text-white font-semilight border border-[rgba(255,255,255,0.5)] outline-none bg-zinc-900"
                ref={inputRef}
                type="text"
                autoComplete="off"
                onKeyDown={(event) => createFolder(event)}
                onChange={(event) => setNewFolder(event.target.value)}
            />
        </div>
    );
};

export default NewRootFolder;
