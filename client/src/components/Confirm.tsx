import { ReactNode, useContext } from "react";
import { GlobalContext } from "../App";

interface Props {
    children: ReactNode;
}

const Confirm = ({ children }: Props) => {
    const { isConfirmWindowOpen, setIsConfirmWindowOpen } =
        useContext(GlobalContext);

    return (
        <div
            className={`flex justify-center items-center absolute w-full h-full transition-opacity duration-300 ease-in-out z-50 ${isConfirmWindowOpen ? "bg-[rgba(0,0,0,0.5)] opacity-100 pointer-events-auto" : "bg-transparent opacity-0 pointer-events-none"}`}
            onClick={() => setIsConfirmWindowOpen(false)}
        >
            {children}
        </div>
    );
};

export default Confirm;
