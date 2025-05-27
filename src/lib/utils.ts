import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Объединяет несколько строк классов tailwind, удаляя конфликты
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
