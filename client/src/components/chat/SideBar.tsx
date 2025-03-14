import { createContext, useContext, useEffect, useState } from "react";
import CreateSection from "./sidebar/CreateSection";
import FoldersAndChats from "./sidebar/FoldersAndChats";
import SidebarHeader from "./sidebar/SidebarHeader";
import { SidebarContext } from "../../routes/_chatLayout";

export const FoldersAndChatsContext = createContext<FoldersAndChatsInterface>(
    {} as FoldersAndChatsInterface
);

const SideBar = () => {
    const [isNewFolder, setIsNewFolder] = useState<boolean>(false);
    const [isNewChat, setIsNewChat] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.querySelector("#sidebar");
            const target = event.target as HTMLElement;
            if (innerWidth < 1024) {
                if (
                    sidebar &&
                    !sidebar.contains(event.target as Node) &&
                    !target.className.includes("sidebar_button")
                ) {
                    setIsSidebarOpen(false);
                }
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`absolute lg:static h-full ${isSidebarOpen ? "max-lg:left-0 max-lg:opacity-100" : "max-lg:-left-full max-lg:opacity-0"} transition-all duration-300 ease-in-out flex flex-col gap-4 font-extralight bg-zinc-950 z-[100000]`}
            id="sidebar"
            style={{
                top: `${document.querySelector(".chat_header")?.clientHeight}px`,
            }}
        >
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
