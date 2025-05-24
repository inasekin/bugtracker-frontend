import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppFile } from '@/types/common';

export type TaskFilesProps = {
	taskId: string;
	oldFiles?: AppFile[];
	files: File[];
	setFiles: (files: File[]) => void;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const TaskFiles = ({ oldFiles, setFiles }: TaskFilesProps) => {
	function handleMultipleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const fileList = event.target.files;
		if (fileList) {
			setFiles(Array.from(fileList));
		}
	}

	const oldFileList: React.ReactElement[] = [];
	if (oldFiles) {
		oldFiles.forEach((file) => {
			const url = `${API_URL}/api/files/show/${file.id}`;
			oldFileList.push(
				<div key={file.id}>
					<a href={url} target="_blank" rel="noopener noreferrer">
						{file.name}
					</a>
				</div>,
			);
		});
	}

	return (
		<Card>
			<CardHeader>Файлы:</CardHeader>
			<CardContent>
				<div>{oldFileList}</div>

				<div className="m-2">Добавить файлы: </div>
				<Input id="picture" type="file" multiple onChange={handleMultipleChange} />
			</CardContent>
		</Card>
	);
};
