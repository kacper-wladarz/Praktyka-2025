import { createContext, ReactNode, useContext } from "react";

const SidebarContext = createContext<SidebarContext | null>(null);

interface Props {
    children: ReactNode;
    props: SidebarContext;
}

export const SidebarContextProvider = ({ children, props }: Props) => {
    return (
        <SidebarContext.Provider value={props}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);

    if (context === null) {
        throw new Error(
            "useSidebarContext should be used within SidebarContextProvider"
        );
    }

    return context;
};
