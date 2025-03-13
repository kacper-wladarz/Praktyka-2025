import { ChangeEvent } from "react";

interface Props {
    type: HTMLInputElement["type"];
    name?: string;
    placeholder?: string;
    autoComplete?: HTMLInputElement["autocomplete"];
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Input({ type, name, placeholder, autoComplete, onChange }: Props) {
    return (
        <input
            type={type}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            onChange={(event) => onChange && onChange(event)}
            className="px-3 py-2 rounded-md border border-white outline-none"
        />
    );
}

export default Input;
