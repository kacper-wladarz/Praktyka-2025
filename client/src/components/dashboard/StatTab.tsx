import { ReactNode } from "react";

interface Props {
    value: number;
    icon?: ReactNode;
    text: string;
}

const StatTab = ({ value, icon, text }: Props) => {
    return (
        <div
            className={`flex-1 basis-[200px] flex flex-col gap-6 items-center bg-zinc-800 p-5 rounded-sm`}
        >
            <div className="flex items-center gap-6">
                {icon}
                <span className="text-7xl font-extralight">{value}</span>
            </div>
            <span className="text-xl font-extralight">{text}</span>
        </div>
    );
};

export default StatTab;
