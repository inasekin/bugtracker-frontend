import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type PriorityType = 'low' | 'medium' | 'high' | 'critical';
type TaskType = 'task' | 'bug' | 'feature';

type TaskCardProps = {
	id: string;
	title: string;
	priority: PriorityType;
	type: TaskType;
	assignee?: {
		name: string;
		avatar?: string;
	};
};

export function TaskCard({ id, title, priority, type, assignee }: TaskCardProps) {
	return (
		<Link to={`/tasks/${id}`} className="block">
			<div className="rounded-md border p-3 shadow-sm hover:shadow-md transition-shadow">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs text-slate-500">#{id}</span>
					<div className="flex items-center space-x-1">
						<span
							className={cn(
								'h-2 w-2 rounded-full',
								priority === 'low' && 'bg-sky-500',
								priority === 'medium' && 'bg-yellow-500',
								priority === 'high' && 'bg-orange-500',
								priority === 'critical' && 'bg-red-500',
							)}
						/>
						<span className="text-xs text-slate-500 capitalize">{priority}</span>
					</div>
				</div>

				<h3 className="text-sm font-medium line-clamp-2 mb-2">{title}</h3>

				<div className="flex items-center justify-between">
					<span
						className={cn(
							'inline-flex items-center rounded-full px-2 py-1 text-xs',
							type === 'bug' && 'bg-red-100 text-red-700',
							type === 'feature' && 'bg-purple-100 text-purple-700',
							type === 'task' && 'bg-blue-100 text-blue-700',
						)}
					>
						{type}
					</span>

					{assignee && (
						<div className="flex items-center space-x-1">
							{assignee.avatar ? (
								<img src={assignee.avatar} alt={assignee.name} className="h-5 w-5 rounded-full" />
							) : (
								<div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
									{assignee.name.charAt(0)}
								</div>
							)}
							<span className="text-xs text-slate-500">{assignee.name}</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
