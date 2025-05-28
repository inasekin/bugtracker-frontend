import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastProps {
	title?: string;
	description?: string;
	variant?: 'default' | 'destructive' | 'success';
	duration?: number;
}

interface ToastContextType {
	toast: (props: ToastProps) => void;
	dismissToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

interface ToastProviderProps {
	children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
	const [toast, setToast] = useState<ToastProps | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const showToast = useCallback((props: ToastProps) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		setToast(props);
		setIsVisible(true);

		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => {
				setToast(null);
			}, 300); // Время анимации исчезновения
		}, props.duration || 3000);
	}, []);

	const dismissToast = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		setIsVisible(false);
		setTimeout(() => {
			setToast(null);
		}, 300);
	}, []);

	return (
		<ToastContext.Provider value={{ toast: showToast, dismissToast }}>
			{children}
			{toast && (
				<div
					className={`fixed bottom-4 right-4 z-50 max-w-md transition-opacity duration-300 ${
						isVisible ? 'opacity-100' : 'opacity-0'
					}`}
					role="alert"
				>
					<div
						className={`rounded-lg shadow-lg p-4 ${
							toast.variant === 'destructive'
								? 'bg-red-600 text-white'
								: toast.variant === 'success'
									? 'bg-green-600 text-white'
									: 'bg-white text-gray-800 border border-gray-200'
						}`}
					>
						<div className="flex items-start">
							<div className="flex-1">
								{toast.title && (
									<h3 className="font-medium text-sm">{toast.title}</h3>
								)}
								{toast.description && (
									<p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
										{toast.description}
									</p>
								)}
							</div>
							<button
								onClick={dismissToast}
								className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
							>
								<span className="sr-only">Закрыть</span>
								<svg
									className="h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}
		</ToastContext.Provider>
	);
};

export default function Toast() {
	return null; // Этот компонент не рендерится напрямую
}
