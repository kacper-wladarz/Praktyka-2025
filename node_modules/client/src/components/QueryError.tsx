interface Props {
    error: string;
}

const QueryError = ({ error }: Props) => {
    return (
        <span className="text-red-600 text-center text-[16px] font-normal tracking-wide">
            {error}
        </span>
    );
};

export default QueryError;
