import { useStats } from "@/api/queries/getStats";
import AdminIcon from "@/assets/AdminIcon";
import Folder from "@/assets/Folder";
import Loading from "@/assets/Loading";
import ChatIcon from "@/assets/ChatIcon";
import MessageIcon from "@/assets/MessageIcon";
import UserIcon from "@/assets/UserIcon";
import StatTab from "@/components/dashboard/StatTab";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from "recharts";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
    component: RouteComponent,
});

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({
    active,
    payload,
}) => {
    const { t } = useTranslation();

    if (active && payload && payload.length) {
        const { date, count } = payload[0].payload;
        return (
            <div className="bg-zinc-900 p-3 rounded-sm text-white opacity-85">
                <p>{`${t("dashboard.panels.stats.customTooltip.date")}: ${format(new Date(date), "dd.MM.yyyy")}`}</p>
                <p>{`${t("dashboard.panels.stats.customTooltip.count")}: ${count}`}</p>
            </div>
        );
    }

    return null;
};

function RouteComponent() {
    const { t } = useTranslation();
    const { data, isPending } = useStats();

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex flex-col gap-8 h-full">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.stats.title")}
            </span>
            {data ? (
                <div className="flex-1 flex flex-col gap-4">
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
                                count: data.admins,
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
                    <div className="flex-[2] flex flex-col">
                        <div className=" flex-1 flex flex-col gap-6 items-start justify-center bg-zinc-800 p-5 rounded-sm">
                            <span className="text-xl font-extralight">
                                {t("dashboard.panels.stats.createdAccounts")}
                            </span>
                            <ResponsiveContainer width="100%">
                                <LineChart data={data.usersInTime}>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) =>
                                            format(new Date(date), "dd.MM.y")
                                        }
                                    />
                                    <YAxis />
                                    <CartesianGrid
                                        strokeDasharray={"3 3"}
                                        opacity={0.1}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="bump"
                                        dataKey="count"
                                        stroke="#FFFFFF"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
