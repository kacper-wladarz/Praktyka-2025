import { useUpdateUser } from "@/api/mutations/updateuser";
import { useUserToUpdate } from "@/api/queries/getUserToUpdate";
import { router } from "@/App";
import Loading from "@/assets/Loading";
import FormError from "@/components/FormError";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
    "/_dashboardLayout/dashboard/users/update/$id"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();
    const { t } = useTranslation();
    const { data, isPending } = useUserToUpdate(id);
    const updateUser = useUpdateUser();
    const [user, setUser] = useState<UserDataToUpdate | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setUser(data);
    }, [data]);

    const handleChange = (key: string, value: string) => {
        setUser((prev) => (prev ? { ...prev, [key]: value.toString() } : null));
    };

    const handleUpdate = () => {
        if (user) {
            updateUser.mutate(
                { id, user },
                {
                    onSuccess: () => {
                        setError(null);
                        router.navigate({ to: "/dashboard/users" });
                    },
                    onError: (error) => {
                        setError(error.message);
                    },
                }
            );
        }
    };

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex flex-col gap-8">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.users.update.title")}
            </span>
            {data ? (
                <table className="font-extralight w-full">
                    <tbody>
                        {Object.entries(data).map((property, index) => (
                            <tr
                                key={property[0]}
                                className={`${!(index % 2) ? "bg-zinc-800" : ""}`}
                            >
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {property[0]}
                                </td>

                                <td className="pl-3 py-2 w-full">
                                    <input
                                        className="bg-zinc-700 outline-none px-2 py-1 w-full"
                                        type="text"
                                        defaultValue={
                                            property[1]
                                                ? String(property[1])
                                                : ""
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                property[0],
                                                event.target.value
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
            <button
                className="bg-sky-800 w-fit text-xl px-3 py-2 rounded-lg cursor-pointer hover:bg-sky-700 transition-[background] duration-200 ease-in-out"
                onClick={() => handleUpdate()}
                disabled={updateUser.isPending}
            >
                {t("dashboard.panels.users.update.updateBtn")}
            </button>
            {error ? <FormError message={error} /> : null}
        </div>
    );
}
