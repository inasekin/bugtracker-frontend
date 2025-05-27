export const AppRoute = {
	Root: '/' as const,
	Login: '/login' as const,
	Register: '/register' as const,
	NotFound: '/404' as const,
	Tasks: '/tasks' as const,
	Projects: '/projects' as const,
	Users: '/users' as const,
	Settings: '/settings' as const,
    VideoCalls: '/videocalls' as const,
} as const;

export const AuthorizationStatus = {
	Auth: 'AUTH' as const,
	NoAuth: 'NO_AUTH' as const,
	Unknown: 'UNKNOWN' as const,
} as const;
