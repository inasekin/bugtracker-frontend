
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//const API_URL = 'http://localhost:5005';

export type File = {
  id: string,
  name: string
};

export const uploadFilesAsync = async (files: any) : Promise<File[]> => {

  if(files.length == 0)
      return [];

  const formData = new FormData();
  files.forEach((file, index) => {
      formData.append(`file${index}`, file);
  });

  const response = await fetch(`${API_URL}/api/files`, {
      method: "POST",
      mode: 'cors',
      credentials: "include",
      body: formData
  });

  if (!response.ok) {
      throw new Error('Ошибка при загрузке файлов');
  }

  const res = await response.json();
  return res as File[];
};
