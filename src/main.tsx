import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/app';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/components/app';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<ToastContainer />
			<App />
		</AuthProvider>
	</QueryClientProvider>,
);
