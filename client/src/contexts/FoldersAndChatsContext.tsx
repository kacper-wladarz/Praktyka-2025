import { createContext, ReactNode, useContext } from "react";

export const FoldersAndChatsContext = createContext<FoldersAndChats | null>(
    null
);

interface Props {
    children: ReactNode;
    props: FoldersAndChats;
}

export const FoldersAndChatsContextProvider = ({ children, props }: Props) => {
    return (
        <FoldersAndChatsContext.Provider value={props}>
            {children}
        </FoldersAndChatsContext.Provider>
    );
};

export const useFoldersAndChatsContext = () => {
    const context = useContext(FoldersAndChatsContext);

    if (context === null) {
        throw new Error(
            "useFoldersAndChatsContext should be used within FoldersAndChatsContextProvider"
        );
    }

    return context;
};
