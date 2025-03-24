const FormError = ({ message }: { message: string }) => {
    return (
        <span className="text-red-500 text-[16px] font-light">{message}</span>
    );
};

export default FormError;
