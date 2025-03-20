import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const UserOperations = () => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 flex justify-around md:justify-end items-center gap-8 sm:gap-4 font-extralight py-4">
            <Link
                to="/"
                className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out h-fit"
            >
                {t("navbar.login")}
            </Link>
            <Link
                to="/registration"
                className="px-4 hover:-translate-y-[2px] transition-[translate] duration-300 ease-in-out h-fit"
            >
                {t("navbar.registration")}
            </Link>
        </div>
    );
};

export default UserOperations;
