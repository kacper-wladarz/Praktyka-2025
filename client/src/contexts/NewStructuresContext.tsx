import { createContext, ReactNode, useContext } from "react";

const NewStructuresContext = createContext<NewStructuresContext | null>(null);

interface Props {
    children: ReactNode;
    props: NewStructuresContext;
}

export const NewStructuresContextProvider = ({ children, props }: Props) => {
    return (
        <NewStructuresContext.Provider value={props}>
            {children}
        </NewStructuresContext.Provider>
    );
};

export const useNewStructuresContext = () => {
    const context = useContext(NewStructuresContext);

    if (context === null) {
        throw new Error(
            "useNewStructuresContext should be used within NewStructuresContextProvider"
        );
    }

    return context;
};
