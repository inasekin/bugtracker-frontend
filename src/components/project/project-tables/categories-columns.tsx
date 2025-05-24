import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button.tsx';
import { ColumnCommand } from '@/types/common';

export type CategoryRecord = {
	id: string;
	category: string;
	assigned: string;
	command: string;
	commands: ColumnCommand[];
};

export const columns: ColumnDef<CategoryRecord>[] = [
	{
		accessorKey: 'category',
		header: () => <div className="text-left">Категория задачи</div>,
		cell: ({ row }) => {
			const formatted = row.original.category;
			return <div className="text-left font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'assigned',
		header: 'Назначена',
	},
	{
		accessorKey: 'command',
		header: '',
		cell: ({ row }) => {
			const commands = row.original.commands;
			const listCommands = commands.map((cmd) => (
				<Button key={cmd.name} variant={cmd.variant} onClick={cmd.action}>
					{cmd.name}
				</Button>
			));

			return <div className="flex justify-end gap-2">{listCommands}</div>;
		},
	},
];
