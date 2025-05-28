import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	userId: string;
	username: string;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	login: (token: string, user: User) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	userId: '',
	username: '',
	isAuthenticated: false,
	isLoading: true,
	token: null,
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Проверка авторизации при загрузке
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (storedToken && storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setToken(storedToken);
			} catch (error) {
				console.error('Ошибка при парсинге данных пользователя:', error);
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		}

		setIsLoading(false);
	}, []);

	const login = (newToken: string, userData: User) => {
		localStorage.setItem('token', newToken);
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
		setToken(newToken);
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		setToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				userId: user?.id || '',
				username: user?.name || '',
				isAuthenticated: !!user,
				isLoading,
				token,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
