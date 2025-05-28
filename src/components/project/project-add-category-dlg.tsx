import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '../ui/input';
import { IssueCategoryDto, UserDto } from './data/project-dto';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useFetch } from './data/use-fetch';

export type ProjectAddCategoryDialogProps = {
	category: IssueCategoryDto;
	setCategory: React.Dispatch<React.SetStateAction<IssueCategoryDto>>;
};

export function ProjectAddCategoryDialog({ category, setCategory }: ProjectAddCategoryDialogProps) {
	const users = useFetch<UserDto[]>('/api/user');
	const usersList = users
		? users.map((u) => <SelectItem value={u.name}>{u.name}</SelectItem>)
		: null;

	const setUserName = (name: string) => {
		setCategory({ ...category, userId: name });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Добавить категорию</CardTitle>
				<CardDescription className="my-2">Укажите номер версии</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="parentProject">Категория</Label>
							<Input
								value={category.categoryName}
								onChange={(e) =>
									setCategory({ ...category, categoryName: e.target.value })
								}
							></Input>
						</div>
						<div className="flex flex-col space-y-2">
							<Label htmlFor="parentProject">Назначенный пользователь</Label>
							<Select onValueChange={setUserName} defaultValue={category.userId}>
								<SelectTrigger id="framework">
									<SelectValue placeholder="Выберите пользователя" />
								</SelectTrigger>
								<SelectContent position="popper" className="bg-white">
									{usersList}
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between"></CardFooter>
		</Card>
	);
}
