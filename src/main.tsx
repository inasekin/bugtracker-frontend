import { AuthProvider } from '@/context/app';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '@/components/app';
import { ToastProvider } from './components/ui/toast';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</AuthProvider>
	</QueryClientProvider>,
);
