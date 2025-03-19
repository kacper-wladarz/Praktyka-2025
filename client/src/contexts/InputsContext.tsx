import { createContext, ReactNode, useContext } from "react";

export const InputsContext = createContext<InputsContext | null>(null);

interface Props {
    children: ReactNode;
    props: InputsContext;
}

export const InputsContextProvider = ({ children, props }: Props) => {
    return (
        <InputsContext.Provider value={props}>
            {children}
        </InputsContext.Provider>
    );
};

export const useInputsContext = () => {
    const context = useContext(InputsContext);

    if (context === null) {
        throw new Error(
            "useInputsContext should be used in InputsContextProvider"
        );
    }

    return context;
};
