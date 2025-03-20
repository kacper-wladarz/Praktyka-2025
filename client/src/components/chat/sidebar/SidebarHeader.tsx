import { useTranslation } from "react-i18next";

const SidebarHeader = () => {
    const { t } = useTranslation();

    return (
        <div className="px-4 py-3">
            <span className="text-2xl font-normal">{t("sidebar.header")}</span>
        </div>
    );
};

export default SidebarHeader;
