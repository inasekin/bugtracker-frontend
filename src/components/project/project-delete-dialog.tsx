import { Button } from '@/components/ui/button';
import { ProjectDto, defaultProjectDto } from './data/project-dto';
import { useNavigate } from 'react-router-dom';
import { useFetchState } from './data/use-fetch';
import { ProjectDialogProps } from './project-dialog';
import { deleteData } from './data/fetch-data';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export const ProjectDeleteDialog = ({ projectId }: ProjectDialogProps) => {
	const [data] = useFetchState<ProjectDto>('/api/project/' + projectId, defaultProjectDto);
	const navigate = useNavigate();

	const deleteCmd = async () => {
		await deleteData('/api/project/' + projectId);
		navigate('/projects', { state: {} });
	};

	return (
		<Card className="w-fit">
			<CardHeader>
				<CardTitle>Удаление проекта</CardTitle>
				<CardDescription>Вы уверены, что хотите удалить проект?</CardDescription>
			</CardHeader>
			<CardContent>{data.name}</CardContent>
			<CardFooter className="flex justify-center  gap-4">
				<Button id="deleteCmd" onClick={() => deleteCmd()}>
					Да
				</Button>
				<Button id="back" onClick={() => navigate('/projects')}>
					Нет
				</Button>
			</CardFooter>
		</Card>
	);
};
