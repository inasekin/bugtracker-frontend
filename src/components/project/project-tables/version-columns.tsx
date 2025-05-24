import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button.tsx';
import { ColumnCommand } from '@/types/common';

export type VersionRecord = {
	version: string;
	commands: ColumnCommand[];
};

export const columns: ColumnDef<VersionRecord>[] = [
	{
		accessorKey: 'version',
		header: () => <div className="text-left">Версия</div>,
		cell: ({ row }) => {
			const formatted = row.original.version;
			return <div className="text-left font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'command',
		header: '',
		cell: ({ row }) => {
			const commands = row.original.commands;
			const listCommands = commands.map((cmd, index) => (
				<Button key={`${cmd.name}-${index}`} variant={cmd.variant} onClick={cmd.action}>
					{cmd.name}
				</Button>
			));

			return <div className="flex justify-end gap-2">{listCommands}</div>;
		},
	},
];
