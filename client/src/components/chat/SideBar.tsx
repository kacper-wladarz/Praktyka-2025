import { createContext, useState } from "react";
import CreateSection from "./sidebar/CreateSection";
import FoldersAndChats from "./sidebar/FoldersAndChats";
import SidebarHeader from "./sidebar/SidebarHeader";

export const FoldersAndChatsContext = createContext<FoldersAndChatsInterface>(
    {} as FoldersAndChatsInterface
);

const SideBar = () => {
    const [isNewFolder, setIsNewFolder] = useState<boolean>(false);
    const [isNewChat, setIsNewChat] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-4 font-extralight">
            <SidebarHeader />
            <FoldersAndChatsContext
                value={{
                    isNewFolder,
                    isNewChat,
                    setIsNewFolder,
                    setIsNewChat,
                    setError,
                }}
            >
                <CreateSection />
                <div
                    className={`auto_height px-4 text-red-500 text-[12px] flex items-center overflow-hidden gap-1 ${error ? "h-auto" : "h-0"} transition-[height] duration-300 ease-in-out`}
                >
                    <button
                        className="p-1 rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-[background] duration-300 ease-in-out"
                        onClick={() => setError(null)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <g
                                fill="#e00"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            >
                                <path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" />
                                <path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" />
                            </g>
                        </svg>
                    </button>
                    <span>{error}</span>
                </div>
                <FoldersAndChats />
            </FoldersAndChatsContext>
        </div>
    );
};

export default SideBar;
