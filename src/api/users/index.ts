import { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export type UserRole = 'admin' | 'manager' | 'developer' | 'tester' | 'viewer';

export type UserDto = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
};

// Моковые данные для пользователей
const mockUsers: UserDto[] = [
	{
		id: '1',
		name: 'Анна Смирнова',
		email: 'anna@example.com',
		role: 'admin',
		avatar: 'https://i.pravatar.cc/150?img=5',
		createdAt: '2023-01-15T10:30:00Z',
		updatedAt: '2023-09-20T14:45:00Z',
	},
	{
		id: '2',
		name: 'Иван Петров',
		email: 'ivan@example.com',
		role: 'developer',
		avatar: 'https://i.pravatar.cc/150?img=12',
		createdAt: '2023-02-10T09:15:00Z',
		updatedAt: '2023-08-15T11:30:00Z',
	},
	{
		id: '3',
		name: 'Ольга Кузнецова',
		email: 'olga@example.com',
		role: 'manager',
		avatar: 'https://i.pravatar.cc/150?img=9',
		createdAt: '2023-03-05T14:20:00Z',
		updatedAt: '2023-09-18T16:40:00Z',
	},
	{
		id: '4',
		name: 'Дмитрий Соколов',
		email: 'dmitry@example.com',
		role: 'tester',
		avatar: 'https://i.pravatar.cc/150?img=15',
		createdAt: '2023-04-20T11:45:00Z',
		updatedAt: '2023-08-30T10:20:00Z',
	},
];

export function useUsers() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);

				// Моковые данные - потом заменим на реальный API
				setTimeout(() => {
					setUsers(mockUsers);
					setLoading(false);
				}, 500);

				/*
        // Код для реального API
        const response = await fetch(`${API_URL}/api/users`, {
          method: "GET",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении пользователей');
        }

        const data = await response.json();
        setUsers(data);
        */
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка при получении пользователей');
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	return { users, loading, error };
}

export function useUser(userId: string) {
	const [user, setUser] = useState<UserDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);

				// Моковые данные - потом заменим на реальный API
				setTimeout(() => {
					const foundUser = mockUsers.find((user) => user.id === userId);
					if (foundUser) {
						setUser(foundUser);
					} else {
						setError('Пользователь не найден');
					}
					setLoading(false);
				}, 500);

				/*
        // Код для реального API
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          method: "GET",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении пользователя');
        }

        const data = await response.json();
        setUser(data);
        */
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка при получении пользователя');
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	return { user, loading, error };
}
