import React, { useContext } from "react";
import { FoldersAndChatsContext } from "../../SideBar";
import { getRootFolders } from "../../../../api/queries/getRootFolders";
import Folder from "./Folder";

const FoldersList = () => {
    const { setError } = useContext(FoldersAndChatsContext);
    const { data, error } = getRootFolders();

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
