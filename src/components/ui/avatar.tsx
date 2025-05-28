import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

// Основные компоненты из RadixUI
const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn('aspect-square h-full w-full', className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			'flex h-full w-full items-center justify-center rounded-full bg-muted',
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

// Новый компонент с функциональностью цветных аватарок на основе имени
interface CustomAvatarProps {
	name: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function CustomAvatar({ name = '', size = 'md', className = '' }: CustomAvatarProps) {
	// Добавляем проверку, если name undefined или пустой
	const safetyName = name || 'U';

	// Генерируем инициалы из имени
	const initials = safetyName
		.split(' ')
		.map((part) => part[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);

	// Генерируем детерминированный цвет на основе имени
	const generateColor = (name: string) => {
		const colors = [
			'bg-blue-500',
			'bg-green-500',
			'bg-yellow-500',
			'bg-red-500',
			'bg-purple-500',
			'bg-pink-500',
			'bg-indigo-500',
			'bg-teal-500',
			'bg-orange-500',
		];

		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}

		return colors[Math.abs(hash) % colors.length];
	};

	const colorClass = generateColor(safetyName);

	// Определяем размер аватара
	const sizeClass = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-12 h-12 text-base',
		lg: 'w-16 h-16 text-xl',
	}[size];

	return (
		<div
			className={`${sizeClass} ${colorClass} ${className} rounded-full flex items-center justify-center text-white font-medium`}
			title={safetyName}
		>
			{initials}
		</div>
	);
}

interface AvatarGroupProps {
	names: string[];
	size?: 'sm' | 'md' | 'lg';
	limit?: number;
}

export function AvatarGroup({ names, size = 'md', limit = 5 }: AvatarGroupProps) {
	const displayNames = names.slice(0, limit);
	const remaining = Math.max(0, names.length - limit);

	// Определяем отрицательный margin для перекрытия
	const marginClass = {
		sm: '-ml-2',
		md: '-ml-3',
		lg: '-ml-4',
	}[size];

	return (
		<div className="flex items-center">
			{displayNames.map((name, index) => (
				<div
					key={name + index}
					className={`${index > 0 ? marginClass : ''} ring-2 ring-white`}
				>
					<CustomAvatar name={name} size={size} />
				</div>
			))}

			{remaining > 0 && (
				<div
					className={`${marginClass} bg-gray-300 ring-2 ring-white rounded-full flex items-center justify-center text-gray-700 font-medium`}
					style={{
						width: size === 'sm' ? '2rem' : size === 'md' ? '3rem' : '4rem',
						height: size === 'sm' ? '2rem' : size === 'md' ? '3rem' : '4rem',
						fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '0.875rem' : '1rem',
					}}
				>
					+{remaining}
				</div>
			)}
		</div>
	);
}
