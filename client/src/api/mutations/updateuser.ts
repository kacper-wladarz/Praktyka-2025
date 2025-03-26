import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

interface MutationProps {
    id: string;
    user: UserDataToUpdate;
}

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: async ({ id, user }: MutationProps) =>
            await api.put(`/dashboard/users/update/${id}`, { ...user }),
    });
};
