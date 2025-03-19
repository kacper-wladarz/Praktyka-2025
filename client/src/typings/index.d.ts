interface GlobalContext {
    isConfirmWindowOpen: boolean;
    setIsConfirmWindowOpen: React.Dispatch<SetStateAction<boolean>>;
    structureToDelete: StructureToDelete;
    setStructureToDelete: React.Dispatch<SetStateAction<StructureToDelete>>;
    chatId: string | null;
    setChatId: React.Dispatch<SetStateAction<string | null>>;
}

interface AuthContext {
    isAuthenticated: boolen;
    JWT: string | null;
    user: UserData | null;
    logout: () => void;
    login: (jwt: string) => void;
}

interface FoldersAndChats {
    isNewFolder: boolean;
    setIsNewFolder: React.Dispatch<SetStateAction<boolean>>;
    isNewChat: boolean;
    setIsNewChat: React.Dispatch<SetStateAction<boolean>>;
    setError: React.Dispatch<SetStateAction<string | null>>;
}

interface NewStructuresContext {
    isOpen: boolean;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

interface InputsContext {
    openedInputId: string | null;
    setOpenedInputId: React.Dispatch<SetStateAction<string | null>>;
}

interface SidebarContext {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<SetStateAction<boolean>>;
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

interface StructureToDelete {
    id: string;
    name: string;
    type: "FOLDER" | "CHAT";
}

interface ChatQueryFilter {
    structureId?: string;
    name?: string;
    type?: "FOLDER" | "CHAT";
}

interface FolderItem {
    id: string;
    name: string;
    type: "FOLDER";
}

interface ChatItem {
    id: string;
    name: string;
    type: "CHAT";
}
