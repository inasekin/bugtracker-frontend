import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/auth/logout`, {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Ошибка выхода');
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success('Вы успешно вышли из системы');
			queryClient.invalidateQueries({ queryKey: ['current'] });
			navigate('/login');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Ошибка выхода');
		},
	});
};
