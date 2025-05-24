import { Link } from 'react-router-dom';
import { DottedSeparator } from '@/components/dotted-separator';
import { Navigation } from '@/components/main/navigation';

export const Sidebar = () => {
	return (
		<aside className="h-full bg-neutral-100 p-4 w-full">
			<Link to={'/'} className="flex items-center">
				<img src={'src/assets/logo.svg'} alt="Logo" />
				<span className="uppercase text-xl ml-2">Bugtracker</span>
			</Link>
			<DottedSeparator className="my-4" />
			<Navigation />
			<DottedSeparator className="my-4" />
		</aside>
	);
};
