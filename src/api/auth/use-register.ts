import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {toast} from "react-toastify";

export const useRegister = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; email: string; password: string }) => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Ошибка регистрации");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Вы успешно зарегистрированы!");
            queryClient.invalidateQueries({ queryKey: ["current"] });
            navigate('/');
        },
        onError: () => {
            toast.error("Ошибка регистрации");
        },
    });
};
