import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useCreateUser = () => {
    return useMutation({
        mutationFn: async ({ login, password, role }: DashboardUserToCreate) =>
            await api.post("/dashboard/users/create", {
                login,
                password,
                role,
            }),
    });
};
