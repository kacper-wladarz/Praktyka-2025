import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { API_URL } from "../../../../main";
import { GlobalContext } from "../../../../App";
import RootFolder from "./RootFolder";

const RootFoldersList = () => {
    const { reqAuth } = useContext(GlobalContext);

    const { data } = useQuery({
        queryKey: ["root-folders"],
        queryFn: async () =>
            await axios
                .get(`${API_URL}/folders/root`, {
                    headers: { ...reqAuth },
                })
                .then((res) => res.data),
        retry: 0,
    });

    return (
        <React.Fragment>
            {data &&
                data.folders.map((folder: Folder) => (
                    <RootFolder
                        key={`root-folder-${folder.id}`}
                        folder={folder}
                    />
                ))}
        </React.Fragment>
    );
};

export default RootFoldersList;
