import { useState } from 'react';
import { useUsers } from '@/api/users';
import { UserCard } from '@/components/users/user-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export const UsersPage = () => {
	const { users, loading, error } = useUsers();
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState<string | null>(null);

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = !roleFilter || user.role === roleFilter;
		return matchesSearch && matchesRole;
	});

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Управление пользователями</CardTitle>
					<CardDescription>Просмотр и управление пользователями системы</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="flex-1">
							<Input
								placeholder="Поиск по имени или email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full"
							/>
						</div>

						<div className="w-full md:w-48">
							<Select
								value={roleFilter || 'all'}
								onValueChange={(value) => setRoleFilter(value === 'all' ? null : value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Все роли" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Все роли</SelectItem>
									<SelectItem value="admin">Администратор</SelectItem>
									<SelectItem value="manager">Менеджер</SelectItem>
									<SelectItem value="developer">Разработчик</SelectItem>
									<SelectItem value="tester">Тестировщик</SelectItem>
									<SelectItem value="viewer">Наблюдатель</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button className="whitespace-nowrap">Добавить пользователя</Button>
					</div>

					{loading ? (
						<div className="text-center py-8">
							<p className="text-slate-500">Загрузка пользователей...</p>
						</div>
					) : error ? (
						<div className="text-center py-8 text-red-500">
							<p>Ошибка: {error}</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
							) : (
								<div className="col-span-full text-center py-8 border rounded-md">
									<p className="text-slate-500">Пользователи не найдены</p>
								</div>
							)}
						</div>
					)}
				</CardContent>

				<CardFooter className="flex justify-between">
					<div className="text-sm text-slate-500">Всего пользователей: {users.length}</div>
					<Button onClick={() => history.back()} variant="outline">
						Назад
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
