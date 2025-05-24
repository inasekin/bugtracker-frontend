import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button.tsx';
import { ColumnCommand } from './column-command';

export type VersionRecord = {
	//id: string,
	version: string;
	//description: string,
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
	} /*
  {
    accessorKey: "description",
    header: () => <div className="text-left">Описание</div>,
  },*/,
	{
		accessorKey: 'command',
		header: '',
		cell: ({ row }) => {
			const commands = row.original.commands;
			const listCommands = commands.map((cmd) => (
				<Button variant={cmd.variant} onClick={cmd.action}>
					{cmd.name}
				</Button>
			));

			// secondary
			// destructive

			return <div className="flex justify-end gap-2">{listCommands}</div>;
		},
	},
];
