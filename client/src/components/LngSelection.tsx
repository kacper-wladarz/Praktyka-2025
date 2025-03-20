import OpenArrow from "@/assets/OpenArrow";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const LngSelection = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { t, i18n } = useTranslation();
    const languages = useMemo(() => {
        return Object.keys(i18n.options.resources || {});
    }, [t, i18n]);

    const handleLngClick = (lng: string) => {
        setIsOpen(false);
        changeLng(lng);
    };

    const changeLng = (lng: string) => {
        i18n.changeLanguage(lng || "pl");
        localStorage.setItem("lng", lng || "pl");
    };

    return (
        <div className="flex items-center text-lg">
            <div
                className="flex items-center gap-1 relative cursor-pointer select-none"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <OpenArrow isOpen={isOpen} />
                <span>{i18n.language.toUpperCase()}</span>
                <div
                    className={`auto_height right-0 absolute top-full z-40 overflow-hidden ${isOpen ? "h-auto opacity-100" : "h-0 opacity-0"} transition-[height,opacity] duration-300 ease-in-out`}
                >
                    <div className="flex flex-col bg-zinc-800 mt-2 rounded-lg overflow-hidden font-extralight">
                        {languages.map((lng) => (
                            <button
                                className="cursor-pointer py-1 px-4 hover:bg-zinc-700 transition-[background] duration-200 ease-in-out"
                                key={`lng-selection-${lng}`}
                                onClick={() => handleLngClick(lng)}
                            >
                                {lng.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LngSelection;
