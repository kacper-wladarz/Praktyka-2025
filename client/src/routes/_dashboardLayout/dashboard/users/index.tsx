import { useUsers } from "@/api/queries/getUsers";
import { router } from "@/App";
import BinIcon from "@/assets/BinIcon";
import EditIcon from "@/assets/EditIcon";
import Loading from "@/assets/Loading";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_dashboardLayout/dashboard/users/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { setIsAdminAuth } = useDashboardContext();
    const { data, isPending, error } = useUsers();
    const { t } = useTranslation();

    useEffect(() => {
        if (error) {
            setIsAdminAuth(false);
        }
    }, [error]);

    if (isPending) {
        return <Loading />;
    }

    const handleUpdate = (id: string) => {
        router.navigate({ to: "/dashboard/users/update/$id", params: { id } });
    };

    const handleDelete = (id: string) => {
        router.navigate({
            to: `/dashboard/users/delete/$id`,
            params: { id },
        });
    };

    return (
        <div className="appear flex flex-col gap-8">
            <div className="w-full flex justify-between items-center">
                <span className="text-4xl font-extralight">
                    {t("dashboard.panels.users.title")}
                </span>
                <button
                    className="text-2xl font-extralight cursor-pointer hover:bg-[#1e1e20] py-2 px-4 rounded-2xl transition-[background] duration-200 ease-in-out"
                    onClick={() =>
                        router.navigate({ to: "/dashboard/users/create" })
                    }
                >
                    {t("dashboard.panels.users.createUser")}
                </button>
            </div>
            {data ? (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th></th>
                                {Object.keys(data[0]).map((header) => (
                                    <th
                                        className="font-normal py-2"
                                        key={`column-header-${header}`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-extralight">
                            {data.map((user, index) => (
                                <tr
                                    className={`${!(index % 2) ? "bg-zinc-800" : ""}`}
                                    key={`user-table-row-${index}`}
                                >
                                    <td className="px-3 border-r border-[rgba(255,255,255,0.3)]">
                                        <div className="flex gap-3 items-center min-h-full">
                                            <button
                                                className="cursor-pointer hover:bg-zinc-700 rounded-full p-1 transition-[background] duration-200 ease-in-out"
                                                onClick={() =>
                                                    handleUpdate(user.id)
                                                }
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="cursor-pointer hover:bg-zinc-700 rounded-full p-1 transition-[background] duration-200 ease-in-out"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                <BinIcon />
                                            </button>
                                        </div>
                                    </td>

                                    {Object.values(user).map((row, index) => (
                                        <td
                                            key={`user-table-cell-${index}`}
                                            className="max-w-72 whitespace-nowrap overflow-hidden text-ellipsis px-3 py-3"
                                            title={row ? String(row) : ""}
                                        >
                                            {row}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
}
