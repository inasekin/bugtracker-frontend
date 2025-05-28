import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useContext } from 'react';
import { ProjectContext } from './data/project-context';

export function ProjectCard() {
	const { project, setProject } = useContext(ProjectContext);

	const setName = (str: string) => setProject({ ...project, name: str });
	const setDescription = (str: string) => setProject({ ...project, description: str });

	return (
		<form>
			<div className="grid w-full items-center gap-4">
				<div className="flex flex-col space-y-2">
					<Label htmlFor="name">Имя проекта</Label>
					<Input
						id="name"
						placeholder="Задайте имя проекта"
						value={project.name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="flex flex-col space-y-2">
					<Label htmlFor="description">Описание проекта</Label>
					<Textarea
						value={project.description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div className="flex flex-col space-y-8">
					<Label htmlFor="itemId">Id: {project.id}</Label>
				</div>
				<div className="flex flex-col space-y-2">
					<Label htmlFor="parentProject">Родительский проект</Label>
					<Select>
						<SelectTrigger id="framework">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent position="popper" className="bg-white">
							<SelectItem value="none">Корневой</SelectItem>
							<SelectItem value="project1">Project 1</SelectItem>
							<SelectItem value="project2">Project 2</SelectItem>
							<SelectItem value="project3">Project 3</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-row space-y-2 gap-4">
					<Checkbox />
					<label htmlFor="terms1">Наследовать участников</label>
				</div>
			</div>
		</form>
	);
}
