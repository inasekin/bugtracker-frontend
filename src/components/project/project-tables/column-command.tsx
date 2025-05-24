import { ColumnCommand } from '@/types/common';

// Переэкспортируем из общих типов
export type { ColumnCommand };

export type ItemAction<T = unknown> = (record: T) => void;
