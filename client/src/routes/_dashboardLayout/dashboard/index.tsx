import { useStats } from "@/api/queries/getStats";
import AdminIcon from "@/assets/AdminIcon";
import Folder from "@/assets/Folder";
import Loading from "@/assets/Loading";
import ChatIcon from "@/assets/MenuChatIcon";
import MessageIcon from "@/assets/MessageIcon";
import UserIcon from "@/assets/UserIcon";
import StatTab from "@/components/dashboard/StatTab";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();
    const { data, isPending } = useStats();

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex flex-col gap-8">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.stats.title")}
            </span>
            {data ? (
                <div className="flex flex-col gap-4">
                    <div className="flex-1 flex gap-4 flex-wrap">
                        <StatTab
                            value={data.users}
                            icon={<UserIcon />}
                            text={t("dashboard.panels.stats.users", {
                                count: data.users,
                            })}
                        />
                        <StatTab
                            value={data.admins}
                            icon={<AdminIcon />}
                            text={t("dashboard.panels.stats.admins", {
                                count: 1,
                            })}
                        />
                    </div>
                    <div className="flex-1 flex gap-4 flex-wrap">
                        <StatTab
                            value={data.folders}
                            icon={<Folder />}
                            text={t("dashboard.panels.stats.folders", {
                                count: data.folders,
                            })}
                        ></StatTab>
                        <StatTab
                            value={data.chats}
                            icon={<ChatIcon />}
                            text={t("dashboard.panels.stats.chats", {
                                count: data.chats,
                            })}
                        ></StatTab>
                        <StatTab
                            value={data.messages}
                            icon={<MessageIcon />}
                            text={t("dashboard.panels.stats.messages", {
                                count: data.messages,
                            })}
                        ></StatTab>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
