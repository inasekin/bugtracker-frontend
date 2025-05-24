import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useFetch } from './data/use-fetch';
import { AppUser } from '@/types/common';

export type UserRole = {
	userId: string;
	userName: string;
	userRoles: string;
};

export type ProjectAddUserDialogProps = {
	userRole: UserRole;
	setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
};

export function ProjectAddUserDialog({ userRole, setUserRole }: ProjectAddUserDialogProps) {
	const users = useFetch<AppUser[]>('/api/user');
	const usersList = users
		? users.map((u) => (
				<SelectItem key={u.id} value={u.name}>
					{u.name}
				</SelectItem>
			))
		: null;

	const roleManager = 'Менеджер проекта';
	const roleDeveloper = 'Разработчик';
	const roleTester = 'Тестировщик';

	const setUserName = (name: string) => {
		setUserRole({
			...userRole,
			userName: name,
		});
	};

	const isChecked = (role: string) => {
		const roles = userRole.userRoles ? userRole.userRoles.split(',') : [];
		return roles.includes(role);
	};

	const setChecked = (role: string, checked: boolean) => {
		let rolesStr = '';
		const roles = userRole.userRoles ? userRole.userRoles.split(',') : [];
		if (checked) {
			if (!roles.includes(role)) roles.push(role);
			rolesStr = roles.join(',');
		} else {
			const filteredRoles = roles.filter((e) => e !== role);
			rolesStr = filteredRoles.join(',');
		}

		setUserRole({
			...userRole,
			userRoles: rolesStr,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Добавить пользователя</CardTitle>
				<CardDescription className="my-2">
					Выберите пользователя и укажите права доступа
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="parentProject">Пользователь</Label>
							<Select onValueChange={setUserName} defaultValue={userRole.userName}>
								<SelectTrigger id="framework">
									<SelectValue placeholder="Выберите пользователя" />
								</SelectTrigger>
								<SelectContent position="popper" className="bg-white">
									{usersList}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-row space-y-2 gap-4">
							<Checkbox
								checked={isChecked(roleManager)}
								onCheckedChange={() => setChecked(roleManager, !isChecked(roleManager))}
							/>{' '}
							<label htmlFor="terms1">{roleManager}</label>
						</div>
						<div className="flex flex-row space-y-2 gap-4">
							<Checkbox
								checked={isChecked(roleDeveloper)}
								onCheckedChange={() => setChecked(roleDeveloper, !isChecked(roleDeveloper))}
							/>{' '}
							<label htmlFor="terms1">{roleDeveloper}</label>
						</div>
						<div className="flex flex-row space-y-2 gap-4">
							<Checkbox
								checked={isChecked(roleTester)}
								onCheckedChange={() => setChecked(roleTester, !isChecked(roleTester))}
							/>{' '}
							<label htmlFor="terms1">{roleTester}</label>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between"></CardFooter>
		</Card>
	);
}
