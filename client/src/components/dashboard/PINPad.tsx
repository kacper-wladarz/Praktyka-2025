import { useCheckPIN } from "@/api/mutations/checkPin";
import EnterIcon from "@/assets/EnterIcon";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { useState } from "react";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PINPad = () => {
    const { isAdminAuth, setIsAdminAuth } = useDashboardContext();
    const [pin, setPin] = useState<string>("");
    const check = useCheckPIN();

    const handleSetPin = (value: string) => {
        if (pin.length < 4) {
            setPin((prev) => prev + value);
        }
    };

    const checkPin = () => {
        if (pin.length === 4) {
            check.mutate(pin, {
                onSuccess: (res) => {
                    if (res.data) {
                        setIsAdminAuth(true);
                    } else {
                        setPin("");
                    }
                },
            });
        }
    };

    return (
        <div
            className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-gradient-to-b from-zinc-900 to-zinc-700 p-8 rounded-xl shadow-[0_0_12px_8px_rgba(255,255,255,0.2)] text-4xl max-w-[340px] flex flex-col gap-8 ${!isAdminAuth ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-300 ease-in-out`}
        >
            <span className="text-center font-extralight tracking-wide">
                Wpisz kod
            </span>
            <div className="flex justify-center items-center border-b border-zinc-200 pb-2">
                <input
                    type="text"
                    value={"*".repeat(pin.length)}
                    disabled
                    className="text-center w-fit tracking-wider"
                />
            </div>
            <div className="grid grid-cols-3 gap-5">
                {numbers.map((number) => (
                    <button
                        className="dashboard_button"
                        key={`dashboard-login-${number}`}
                        onClick={() => handleSetPin(number.toString())}
                    >
                        {number}
                    </button>
                ))}
                <button className="dashboard_button" onClick={() => setPin("")}>
                    C
                </button>
                <button
                    className="dashboard_button"
                    onClick={() => handleSetPin((0).toString())}
                >
                    0
                </button>
                <button
                    className="dashboard_button flex justify-center items-center"
                    onClick={() => checkPin()}
                >
                    <EnterIcon />
                </button>
            </div>
        </div>
    );
};

export default PINPad;
