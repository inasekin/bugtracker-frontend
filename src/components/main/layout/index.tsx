import { Sidebar } from '@/components/main/sidebar';
import { Navbar } from '@/components/main/navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
	return (
		<div className="min-h-screen">
			<div className="flex h-full w-full">
				<div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
					<Sidebar />
				</div>
				<div className="lg:pl-[264px] w-full">
					<div className="mx-auto max-w-screen-2xl h-full">
						<Navbar />
						<main className="h-full py-8 px-6 flex flex-col">
							<Outlet />
						</main>
					</div>
				</div>
			</div>
		</div>
	);
};
