import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

const RootArea = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: "",
    });
    const { t } = useTranslation();

    return (
        <div
            ref={setNodeRef}
            className={`w-full h-12 opacity-60 flex justify-center items-center transition-[background] duration-300 ease-in-out ${isOver ? "bg-zinc-700" : "bg-zinc-950"}`}
        >
            <span className="pointer-events-none select-none">
                {t("sidebar.rootArea")}
            </span>
        </div>
    );
};

export default RootArea;
