import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	CategoryRecord,
	columns,
} from '@/components/project/project-tables/categories-columns.tsx';
import { DataTable } from '@/components/project/project-tables/data-table';
import { ProjectAddCategoryDialog } from '@/components/project/project-add-category-dlg';
import { useContext, useState } from 'react';
import { ProjectContext } from './data/project-context';
import { IssueCategory } from '@/types/common';

export type ItemAction = (record: IssueCategory) => void;

function categoriesFromProject(
	categoriesDto: IssueCategory[],
	editAction: ItemAction,
	deleteAction: ItemAction,
): CategoryRecord[] {
	if (categoriesDto == null) return [];

	const categories = new Array<CategoryRecord>();
	categoriesDto.forEach((item) => {
		categories.push({
			id: item.categoryName,
			category: item.categoryName,
			assigned: item.userId || '',
			command: 'Редактировать',
			commands: [
				{
					name: 'Редактировать',
					variant: 'secondary',
					action: () => editAction(item),
				},
				{
					name: 'Удалить',
					variant: 'destructive',
					action: () => deleteAction(item),
				},
			],
		} as CategoryRecord);
	});
	return categories;
}

export function CategoriesList() {
	const { project, setProject } = useContext(ProjectContext);
	const [category, setCategory] = useState<IssueCategory>({ categoryName: '' });
	const [prevCategory, setPrevCategory] = useState('');
	const [dlgShowed, setDlgShowed] = useState(false);

	const addCategory = () => {
		const newProject = { ...project };
		newProject.issueCategories = [...newProject.issueCategories];
		const index = project.issueCategories.findIndex((cat) => cat.categoryName === prevCategory);
		if (index > -1) newProject.issueCategories[index] = { ...category };
		else newProject.issueCategories.push(category);
		setProject(newProject);
		setDlgShowed(false);
	};

	const editCategory = (item: IssueCategory) => {
		setCategory({
			...item,
		});
		setPrevCategory(item.categoryName);
		setDlgShowed(true);
	};

	const deleteCategory = (item: IssueCategory) => {
		const newProject = { ...project };
		newProject.issueCategories = [...newProject.issueCategories];

		const index = newProject.issueCategories.findIndex(
			(cat) => cat.categoryName === item.categoryName,
		);
		if (index > -1) newProject.issueCategories.splice(index, 1);

		setProject(newProject);
	};

	const showDlg = () => {
		setCategory({
			categoryName: '',
		});
		setPrevCategory('');
		setDlgShowed(true);
	};

	if (dlgShowed) {
		return (
			<div>
				<ProjectAddCategoryDialog
					category={category}
					setCategory={setCategory}
				></ProjectAddCategoryDialog>
				<br />
				<Button onClick={() => addCategory()}>Добавить</Button>
				<Button onClick={() => setDlgShowed(false)}>Отмена</Button>
			</div>
		);
	} else {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Категории задач</CardTitle>
					<CardDescription className="my-2">
						Каждый проект разбивается на категории(модули/микросервисы).
						<br />
						Каждой категории назначается один ответственный на которого отправляются
						задачи относящиеся к категории.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="container mx-auto ">
						<DataTable
							columns={columns}
							data={categoriesFromProject(
								project.issueCategories,
								editCategory,
								deleteCategory,
							)}
						/>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button id="add" onClick={() => showDlg()}>
						Добавить категорию...
					</Button>
				</CardFooter>
			</Card>
		);
	}
}
