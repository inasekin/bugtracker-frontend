import { useParams, useSearchParams } from 'react-router-dom';
import { ProjectsList } from '@/components/project/projects-list';
import { ProjectDialog } from '../../components/project/project-dialog';
import { ProjectDeleteDialog } from '@/components/project/project-delete-dialog';

const commandNew = 'new';
const commandDelete = 'delete';

export const ProjectsPage = () => {
	const params = useParams();
	const projectId = params.id;

	const [searchParams] = useSearchParams();
	const command = searchParams.get('command');

	if (projectId) {
		if (command == commandDelete) {
			return <ProjectDeleteDialog projectId={projectId} />;
		} else {
			return <ProjectDialog projectId={projectId} isNewProject={command == commandNew} />;
		}
	} else {
		if (command == commandNew) {
			return <ProjectDialog isNewProject={command == commandNew} />;
		} else {
			return <ProjectsList />;
		}
	}
};
