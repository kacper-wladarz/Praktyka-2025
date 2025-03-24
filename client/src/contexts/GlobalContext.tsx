import { createContext, ReactNode, useContext } from "react";

const GlobalContext = createContext<GlobalContext | null>(null);

interface Props {
    children: ReactNode;
    props: GlobalContext;
}

export const GlobalContextProvider = ({ children, props }: Props) => {
    return (
        <GlobalContext.Provider value={props}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (context === null) {
        throw new Error(
            "useGlobalContext should be used within GlobalContextProvider"
        );
    }

    return context;
};
