import { AppFile } from '@/types/common';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export type File = AppFile;

export const uploadFilesAsync = async (files: File[]): Promise<AppFile[]> => {
	if (files.length === 0) {
		return [];
	}

	const formData = new FormData();
	files.forEach((file: any, index: number) => {
		formData.append(`file${index}`, file);
	});

	const response = await fetch(`${API_URL}/api/files`, {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		body: formData,
	});

	if (!response.ok) {
		throw new Error('Ошибка при загрузке файлов');
	}

	const res = await response.json();
	return res as AppFile[];
};
