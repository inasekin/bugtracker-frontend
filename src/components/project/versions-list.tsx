import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { VersionRecord, columns } from '@/components/project/project-tables/version-columns.tsx';
import { DataTable } from '@/components/project/project-tables/data-table';
import { ProjectAddVersionDialog } from '@/components/project/project-add-version-dlg';
import { useContext, useState } from 'react';
import { ProjectContext } from './data/project-context';

export type ItemAction = (record: string) => void;

function versionsFromProject(
	versionsDto: string[],
	editAction: ItemAction,
	deleteAction: ItemAction,
): VersionRecord[] {
	if (versionsDto == null) return [];

	const versions = new Array<VersionRecord>();
	versionsDto.forEach((item) => {
		versions.push({
			version: item,
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
		} as VersionRecord);
	});
	return versions;
}

export function VersionsList() {
	const { project, setProject } = useContext(ProjectContext);
	const [version, setVersion] = useState('');
	const [prevVersion, setPrevVersion] = useState('');
	const [dlgShowed, setDlgShowed] = useState(false);

	const addVersion = () => {
		const newProject = { ...project };
		newProject.versions = [...newProject.versions];
		const index = newProject.versions.indexOf(prevVersion);
		if (index > -1) newProject.versions[index] = version;
		else newProject.versions.push(version);
		setProject(newProject);
		setDlgShowed(false);
	};

	const editVersion = (version: string) => {
		setVersion(version);
		setPrevVersion(version);
		setDlgShowed(true);
	};

	const deleteVersion = (version: string) => {
		const newProject = { ...project };
		newProject.versions = [...newProject.versions];

		const index = newProject.versions.indexOf(version);
		if (index > -1) newProject.versions.splice(index, 1);

		setProject(newProject);
	};

	const showDlg = () => {
		setVersion('');
		setPrevVersion('');
		setDlgShowed(true);
	};

	if (dlgShowed) {
		return (
			<div>
				<ProjectAddVersionDialog
					version={version}
					setVersion={setVersion}
				></ProjectAddVersionDialog>
				<br />
				<Button onClick={() => addVersion()}>Добавить</Button>
				<Button onClick={() => setDlgShowed(false)}>Отмена</Button>
			</div>
		);
	} else {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Версии</CardTitle>
					<CardDescription className="my-2">
						Версии проекта используются для фиксации изменений. <br />
						При создании замечания указывается начальная версия начиная с которой необходимо
						исправить замечание.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="container mx-auto ">
						<DataTable
							columns={columns}
							data={versionsFromProject(project.versions, editVersion, deleteVersion)}
						/>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button id="addUser" onClick={() => showDlg()}>
						Добавить версию...
					</Button>
				</CardFooter>
			</Card>
		);
	}
}
