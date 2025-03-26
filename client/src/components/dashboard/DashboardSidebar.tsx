import { router } from "@/App";
import { Route } from "@/routes/_dashboardLayout";
import { useTranslation } from "react-i18next";

const isActive = (panelLink: string, path: string) => {
    if (panelLink === "") return path === "";
    return path.startsWith(panelLink + "/") || path === panelLink;
};

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const panels = [
        { name: t("dashboard.panels.stats.name"), link: "" },
        { name: t("dashboard.panels.users.name"), link: "/users" },
        { name: t("dashboard.panels.ai.name"), link: "/ai" },
        { name: t("dashboard.panels.settings.name"), link: "/settings" },
    ];
    const path = Route.useLoaderData().replace("/dashboard", "");

    return (
        <div className="bg-zinc-950 flex flex-col text-xl font-extralight overflow-hidden">
            {panels.map((panel) => (
                <div
                    className={`cursor-pointer relative`}
                    key={`${panel.link}-panel`}
                >
                    <div
                        className={`auto_height z-0 absolute h-full top-0 right-0 ${
                            isActive(panel.link, path) ? "w-full" : "w-0"
                        } transition-[width] bg-zinc-900 duration-300 ease-in-out dashboard_option_bottom_shape 
                        after:w-5 after:h-5 after:block after:bg-zinc-900 after:absolute after:right-0 
                        after:transition-all after:duration-300 after:ease-in-out after:opacity-0 
                        before:w-5 before:h-5 before:block before:bg-zinc-900 before:absolute before:right-0 
                        before:transition-all before:duration-300 before:ease-in-out before:opacity-0 ${
                            isActive(panel.link, path)
                                ? "after:top-full before:bottom-full after:opacity-100 before:opacity-100"
                                : "after:top-0 before:bottom-0 after:opacity-0 before:opacity-0"
                        }`}
                    ></div>

                    <button
                        onClick={() =>
                            router.navigate({ to: `/dashboard${panel.link}` })
                        }
                        className={`z-10 px-5 py-2 w-full bg-transparent text-left cursor-pointer 
                        hover:translate-x-0.5 transition-transform duration-300 ease-in-out relative`}
                    >
                        {panel.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DashboardSidebar;
