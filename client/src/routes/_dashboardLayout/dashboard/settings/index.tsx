import { useUpdateSettings } from "@/api/mutations/updateSettings";
import { useSettings } from "@/api/queries/getSettings";
import { router } from "@/App";
import Loading from "@/assets/Loading";
import FormError from "@/components/FormError";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_dashboardLayout/dashboard/settings/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data, isPending } = useSettings();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const { t } = useTranslation();
    const updateSettings = useUpdateSettings();
    const [error, setError] = useState<string | null>(null);
    const isChanged = useMemo(() => {
        if (data && settings) {
            let isChanged = false;
            Object.entries(data.settings).map((setting) => {
                if (setting[1] !== settings[setting[0]]) {
                    isChanged = true;
                }
            });
            return isChanged;
        }
    }, [data, settings]);

    useEffect(() => {
        if (data) {
            setSettings(data.settings);
        }
    }, [data]);

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdate = () => {
        updateSettings.mutate(settings, {
            onSuccess: () => {
                router.navigate({
                    to: "/dashboard/settings/success",
                    state: { allow: true },
                });
            },
            onError: (error) => setError(error.message),
        });
    };

    if (isPending) {
        return <Loading />;
    }

    return (
        <div className="appear flex flex-col gap-8">
            <span className="text-4xl font-extralight">
                {t("dashboard.panels.settings.title")}
            </span>
            <span>
                {data.toReset ? (
                    <span className="text-2xl font-extralight text-red-500">
                        {t("dashboard.panels.settings.serverToReset")}
                    </span>
                ) : null}
            </span>
            {data.settings ? (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <tbody className="font-extralight">
                            {Object.entries(data.settings).map(
                                (setting, index) => (
                                    <tr
                                        className={`${!(index % 2) ? "bg-zinc-800" : ""}`}
                                        key={`setting-row-${index}`}
                                    >
                                        <td className="px-3 py-2">
                                            {setting[0]}
                                        </td>
                                        <td className="pl-3 py-2 w-full">
                                            <div className="w-full overflow-x-auto">
                                                <input
                                                    className="bg-zinc-700 w-full outline-none px-2 py-1 whitespace-nowrap"
                                                    type="text"
                                                    defaultValue={
                                                        setting[1]
                                                            ? String(setting[1])
                                                            : ""
                                                    }
                                                    onChange={(event) =>
                                                        handleChange(
                                                            setting[0],
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            ) : null}
            <button
                className="bg-sky-800 w-fit text-xl px-3 py-2 rounded-lg disabled:bg-zinc-600 not-disabled:cursor-pointer not-disabled:hover:bg-sky-700 transition-[background] duration-200 ease-in-out"
                onClick={() => handleUpdate()}
                disabled={!isChanged || updateSettings.isPending}
            >
                {t("dashboard.panels.settings.saveBtn")}
            </button>
            {error ? <FormError message={error} /> : null}
        </div>
    );
}
