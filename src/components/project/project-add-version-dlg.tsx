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

export type ProjectAddVersionDialogProps = {
	version: string;
	setVersion: React.Dispatch<React.SetStateAction<string>>;
};

export function ProjectAddVersionDialog({ version, setVersion }: ProjectAddVersionDialogProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Добавить версию</CardTitle>
				<CardDescription className="my-2">Укажите номер версии</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="parentProject">Версия</Label>
							<Input value={version} onChange={(e) => setVersion(e.target.value)}></Input>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between"></CardFooter>
		</Card>
	);
}
