import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { AppRoute, AuthorizationStatus } from '@/const.ts';
import { NotFoundPage } from '@/pages/not-found';
import { MainPage } from '@/pages/main';
import { PrivateRoute } from '@/components/main/private-route';
import { Layout } from '@/components/main/layout';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { AuthLayout } from '@/components/main/layout/auth-layout';
import { TasksPage } from '@/pages/tasks';
import { ProjectsPage } from '@/pages/projects';
import { UsersPage } from '@/pages/users';
import { SettingsPage } from '@/pages/settings';
import { VideoCallsPage } from '@/pages/videocalls';
import { VideoCallRoomPage } from '@/pages/videocalls/[id]';
import { JoinRoomPage } from '@/pages/videocalls/join';
import { JoinPage } from '@/pages/videocalls/JoinPage';

export const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path={AppRoute.Login}
					element={
						<PrivateRoute
							restrictedFor={AuthorizationStatus.Auth}
							redirectTo={AppRoute.Root}
						>
							<AuthLayout>
								<LoginPage />
							</AuthLayout>
						</PrivateRoute>
					}
				/>
				<Route
					path={AppRoute.Register}
					element={
						<PrivateRoute
							restrictedFor={AuthorizationStatus.Auth}
							redirectTo={AppRoute.Root}
						>
							<AuthLayout>
								<RegisterPage />
							</AuthLayout>
						</PrivateRoute>
					}
				/>

				{/* Публичные маршруты, доступные без авторизации */}
				<Route path={`${AppRoute.VideoCalls}/join`} element={<JoinPage />} />
				<Route path={`${AppRoute.VideoCalls}/:id`} element={<VideoCallRoomPage />} />

				<Route
					element={
						<PrivateRoute
							restrictedFor={AuthorizationStatus.NoAuth}
							redirectTo={AppRoute.Login}
						>
							<Layout />
						</PrivateRoute>
					}
				>
					<Route index element={<MainPage />} />
					<Route path={AppRoute.Tasks} element={<TasksPage />} />
					<Route path={AppRoute.Projects} element={<ProjectsPage />}>
						<Route path=":id" element={<ProjectsPage />} />
					</Route>
					<Route path={AppRoute.Users} element={<UsersPage />}>
						<Route path=":id" element={<UsersPage />} />
					</Route>
					<Route path={AppRoute.Settings} element={<SettingsPage />} />
					<Route path={AppRoute.VideoCalls} element={<VideoCallsPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
};
