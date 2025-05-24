import { createContext } from 'react';
import { ProjectDto, defaultProjectDto } from './project-dto';

export type ProjectDialogType = {
	project: ProjectDto;
	setProject: React.Dispatch<React.SetStateAction<ProjectDto>>;
};

export const ProjectContext = createContext<ProjectDialogType>({
	project: defaultProjectDto,
	setProject: () => {},
});
