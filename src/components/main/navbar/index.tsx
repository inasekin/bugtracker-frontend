import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileSidebar } from '../mobile-sidebar';
import { UserButton } from '../../user-button';

interface PageInfo {
	title: string;
	description: string;
}

const pathnameMap: Record<string, PageInfo> = {
	tasks: {
		title: 'Мои задачи',
		description: 'Управляйте своими задачами здесь',
	},
	projects: {
		title: 'Мои проекты',
		description: 'Управляйте своими проектами здесь',
	},
	settings: {
		title: 'Настройки',
		description: 'Ваши настройки',
	},
};

const defaultMap: PageInfo = {
	title: 'Главная',
	description: 'Контролируйте все свои проекты и задачи здесь',
};

export const Navbar: React.FC = () => {
	const { pathname } = useLocation();

	const parts = pathname.split('/');
	const key = parts[1];

	const pageInfo = key && pathnameMap[key] ? pathnameMap[key] : defaultMap;

	return (
		<nav className="pt-4 px-6 flex items-center justify-between">
			<div className="flex-col hidden lg:flex">
				<h1 className="text-2xl font-bold">{pageInfo.title}</h1>
				<p className="text-muted-foreground">{pageInfo.description}</p>
			</div>
			<MobileSidebar />
			<UserButton />
		</nav>
	);
};
