import { useDeleteUser } from "@/api/mutations/deleteUser";
import { useUser } from "@/api/queries/getUser";
import { router } from "@/App";
import FormError from "@/components/FormError";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
    "/_dashboardLayout/dashboard/users/delete/$id"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();
    const { data } = useUser(id);
    const deleteUser = useDeleteUser();
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleDelete = () => {
        deleteUser.mutate(id, {
            onSuccess: () => {
                router.navigate({
                    to: "/dashboard/users/delete/success",
                    state: { allow: true },
                });
            },
            onError: (error) => setError(error.message),
        });
    };

    return (
        <div className="appear flex flex-col gap-8">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.users.delete.title")}
            </span>
            {data ? (
                <table className="font-extralight ">
                    <tbody>
                        {Object.entries(data).map((property, index) => (
                            <tr
                                className={`${!(index % 2) ? "bg-zinc-800" : ""}`}
                            >
                                {property.map((cell) => (
                                    <td className="px-3 py-2">
                                        {cell ? String(cell) : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
            <button
                className="bg-red-600 w-fit text-xl px-3 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-[background] duration-200 ease-in-out"
                disabled={deleteUser.isPending}
                onClick={() => handleDelete()}
            >
                {t("dashboard.panels.users.delete.deleteBtn")}
            </button>
            {error ? <FormError message={error} /> : null}
        </div>
    );
}
