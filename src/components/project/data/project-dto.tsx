export interface Dictionary<T> {
    [Key: string]: T;
};

export interface UserRoleDictionary {
    [Key: string]: string;
};

export type IssueCategoryDto = {
    categoryName: string;
    userId? : string;
};

export type ProjectDto = {
    id: string,
    name: string,
    description: string,
    userRoles: UserRoleDictionary
    versions: string[]
    issueCategories:  IssueCategoryDto[]
};

export const defaultProjectDto: ProjectDto = {
        id: "",
        name: "",
        description: "",
        versions: [],
        issueCategories: [],
        userRoles: {}
};
