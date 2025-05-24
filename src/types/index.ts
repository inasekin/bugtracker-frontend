import { AppRoute, AuthorizationStatus } from '@/const';

export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];
export type AuthStatus = (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
