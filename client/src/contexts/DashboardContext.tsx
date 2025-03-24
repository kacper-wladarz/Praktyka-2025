import { createContext, ReactNode, useContext } from "react";

const DashboardContext = createContext<DashboardContext | null>(null);

interface Props {
    children: ReactNode;
    props: DashboardContext;
}

export const DashboardContextProvider = ({ children, props }: Props) => {
    return (
        <DashboardContext.Provider value={props}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);

    if (context === null) {
        throw new Error(
            "useDashboardContext should be used within DashboardContextProvider"
        );
    }

    return context;
};
