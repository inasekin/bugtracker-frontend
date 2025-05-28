import { Link } from 'react-router-dom';
import { ProjectDto } from '@/api/projects';

type ProjectCardProps = {
	project: ProjectDto;
};

export function ProjectCard({ project }: ProjectCardProps) {
	// Проверка на наличие userRoles перед получением длины
	const userCount = project.userRoles ? Object.keys(project.userRoles).length : 0;

	return (
		<Link
			to={`/projects/${project.id}`}
			className="block rounded-md border p-4 hover:shadow-md transition-shadow"
		>
			<h3 className="font-medium text-base mb-2 line-clamp-1">{project.name}</h3>
			<p className="text-sm text-slate-500 mb-3 line-clamp-2">{project.description}</p>

			<div className="flex items-center justify-between text-xs text-slate-500">
				<div className="flex items-center space-x-3">
					<div>
						<span>{userCount}</span>{' '}
						{userCount === 1
							? 'участник'
							: userCount > 1 && userCount < 5
								? 'участника'
								: 'участников'}
					</div>
					<div>
						<span>{project.versions?.length || 0}</span>{' '}
						{(project.versions?.length || 0) === 1
							? 'версия'
							: (project.versions?.length || 0) > 1 &&
								  (project.versions?.length || 0) < 5
								? 'версии'
								: 'версий'}
					</div>
				</div>
				<div>
					<span>{project.issueCategories?.length || 0}</span>{' '}
					{(project.issueCategories?.length || 0) === 1
						? 'категория'
						: (project.issueCategories?.length || 0) > 1 &&
							  (project.issueCategories?.length || 0) < 5
							? 'категории'
							: 'категорий'}
				</div>
			</div>
		</Link>
	);
}
