import { useFoldersAndChatsContext } from "@contexts/FoldersAndChatsContext";
import { useTranslation } from "react-i18next";

const CreateSection = () => {
    const { t } = useTranslation();
    const { isNewFolder, setIsNewFolder, isNewChat, setIsNewChat } =
        useFoldersAndChatsContext();

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-4">
                <span>{t("sidebar.newFolder")}</span>
                <button
                    className="rounded-full p-1 not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] transition-[background] duration-300 ease-in-out"
                    onClick={() =>
                        !isNewFolder && !isNewChat && setIsNewFolder(true)
                    }
                    disabled={isNewFolder}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="pointer-events-none select-none"
                    >
                        <path
                            fill="currentColor"
                            d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"
                        />
                    </svg>
                </button>
            </div>
            <div className="flex justify-between items-center gap-2 px-4">
                <span>{t("sidebar.newChat")}</span>
                <button
                    className="rounded-full p-1 not-disabled:cursor-pointer not-disabled:hover:bg-[rgba(255,255,255,0.2)] transition-[background] duration-300 ease-in-out"
                    onClick={() =>
                        !isNewFolder && !isNewChat && setIsNewChat(true)
                    }
                    disabled={isNewChat}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="pointer-events-none select-none"
                    >
                        <path
                            fill="currentColor"
                            d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CreateSection;
