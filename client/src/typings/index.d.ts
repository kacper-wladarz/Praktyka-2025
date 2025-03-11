interface GlobalContextInterface {
    JWT: string | null;
    setJWT: React.Dispatch<SetStateAction<string | null>>;
    userData: UserData | null;
    reqAuth: reqAuth;
}

interface FoldersAndChatsInterface {
    isNewFolder: boolean;
    setIsNewFolder: React.Dispatch<SetStateAction<boolean>>;
    isNewChat: boolean;
    setIsNewChat: React.Dispatch<SetStateAction<boolean>>;
    setError: React.Dispatch<SetStateAction<string | null>>;
}

interface NewStructuresContext {
    isOpen: boolean;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
    isNewFolderOpen: boolean;
    setIsNewFolderOpen: React.Dispatch<SetStateAction<boolean>>;
    isNewChatOpen: boolean;
    setIsNewChatOpen: React.Dispatch<SetStateAction<boolean>>;
}

interface LoginData {
    login: string;
    password: string;
}

interface UserData {
    login: string;
}

interface RegistrationData {
    login: string;
    password: string;
    repeatPassword: string;
}

interface reqAuth {
    Authorization: string;
}

interface Folder {
    id: string;
    name: string;
    userId: string;
    parentId: string;
    type: "FOLDER";
}

interface Chat {
    id: string;
    name: string;
    userId: string;
    folderId: string;
    type: "CHAT";
}

interface MessageData {
    id: string;
    body: string;
    userId: string | null;
}
