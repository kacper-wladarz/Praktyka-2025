import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface Props {
    id: string;
    isOpen: boolean;
}

export const useFolderStructures = ({ id, isOpen }: Props) => {
    const { data } = useQuery({
        queryKey: ["folders", id],
        queryFn: async () =>
            await api
                .get(`/structures/list?folder-id=${id}`)
                .then((res) => res.data),
        retry: 0,
        enabled: !!isOpen,
    });

    return { data };
};
