import React from "react";
import Folder from "./Folder";
import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useRootFolders } from "@queries/getRootFolders";

const FoldersList = () => {
    const { setError } = useFoldersAndChatsContext();
    const { data, error } = useRootFolders();

    if (error) setError(error.message);

    return (
        <React.Fragment>
            {data &&
                data.folders.map((folder: Folder) => (
                    <Folder key={`root-folder-${folder.id}`} folder={folder} />
                ))}
        </React.Fragment>
    );
};

export default FoldersList;
