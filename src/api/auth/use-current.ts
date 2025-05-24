import { useQuery } from '@tanstack/react-query';

export const useCurrent = () => {
	return useQuery({
		queryKey: ['current'],
		queryFn: async () => {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/auth/current`, {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Unauthorized');
			}

			const { data } = await response.json();
			return data;
		},
		staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
		retry: false,
		enabled: true,
	});
};
