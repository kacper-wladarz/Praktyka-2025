import { useUsers } from "@/api/queries/getUsers";
import Loading from "@/assets/Loading";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "@/App.tsx";

export const Route = createFileRoute("/_dashboardLayout/dashboard/users")({
    component: RouteComponent,
    pendingComponent: () => <Loading />,
});

function RouteComponent() {
    const { setIsAdminAuth } = useDashboardContext();
    const { data, isPending, error } = useUsers();

    useEffect(() => {
        if (error) {
            setIsAdminAuth(false);
        }
    }, [error]);

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex flex-col gap-8">
            <div className="w-full flex justify-between items-center">
                <span className="text-4xl font-extralight">Użytkownicy</span>
                <button
                    className="text-2xl font-extralight cursor-pointer hover:bg-[#1e1e20] py-2 px-4 rounded-2xl transition-[background] duration-200 ease-in-out"
                    onClick={() => router.navigate({ to: "/dashboard/create" })}
                >
                    Stwórz
                </button>
            </div>
            {data ? (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((header) => (
                                    <th className="font-normal py-2">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="font-extralight">
                            {data.map((user, index) => (
                                <tr
                                    className={`${!(index % 2) ? "bg-zinc-800" : ""}`}
                                >
                                    {Object.values(user).map((row) => (
                                        <td
                                            className="max-w-72 whitespace-nowrap overflow-hidden text-ellipsis px-6 py-3"
                                            title={row}
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
