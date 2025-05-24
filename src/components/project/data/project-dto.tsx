export type {
	Project as ProjectDto,
	IssueCategory as IssueCategoryDto,
	UserRoleDictionary,
	AppUser as UserDto,
} from '@/types/common';

export interface Dictionary<T> {
	[Key: string]: T;
}

export const defaultProjectDto = {
	id: '',
	name: '',
	description: '',
	versions: [],
	issueCategories: [],
	userRoles: {},
};
