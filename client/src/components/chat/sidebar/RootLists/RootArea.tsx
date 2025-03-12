import { useDroppable } from "@dnd-kit/core";

const RootArea = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: "",
    });
    return (
        <div
            ref={setNodeRef}
            className={`w-full h-12 opacity-60 flex justify-center items-center transition-[background] duration-300 ease-in-out ${isOver ? "bg-zinc-700" : "bg-zinc-950"}`}
        >
            <span>Główny folder</span>
        </div>
    );
};

export default RootArea;
