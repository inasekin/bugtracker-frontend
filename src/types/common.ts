export interface ApiResponse<T> {
	data: T;
	message?: string;
	status?: 'success' | 'error';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination?: {
		page: number;
		limit: number;
		total: number;
	};
}

// Пользователь
export interface User {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

// Файл
export interface AppFile {
	id: string;
	name: string;
	url?: string;
	size?: number;
}

// Проект
export interface Project {
	id: string;
	name: string;
	description: string;
	userRoles: UserRoleDictionary;
	versions: string[];
	issueCategories: IssueCategory[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IssueCategory {
	categoryName: string;
	userId?: string;
}

export interface UserRoleDictionary {
	[userId: string]: string[];
}

// Задача
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'task' | 'bug' | 'feature';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	type: TaskType;
	projectId: string;
	assigneeId?: string;
	assignee?: User;
	createdAt: string;
	updatedAt: string;
	dueDate?: string;
	files?: AppFile[];
}

// Комментарий
export interface Comment {
	id: string;
	issueId: string;
	authorId: string;
	content?: string;
	createdAtTime: string;
	updatedAtTime: string;
}

// Уведомление
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
	id: string;
	title: string;
	message: string;
	createdAt: string;
	type: NotificationType;
	read: boolean;
}

// Роли пользователей
export type UserRole = 'admin' | 'manager' | 'developer' | 'tester' | 'viewer';

export interface AppUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
}

// Команды для таблиц
export interface ColumnCommand {
	name: string;
	variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
	action: () => void;
}
