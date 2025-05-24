import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button.tsx';
import { ColumnCommand } from '@/types/common';

export type UserRolesRecord = {
	id: string;
	user: string;
	roles: string;
	commands: ColumnCommand[];
};

export const columns: ColumnDef<UserRolesRecord>[] = [
	{
		accessorKey: 'user',
		header: () => <div className="text-left">Пользователь/Группа</div>,
		cell: ({ row }) => {
			const userRoles = row.original;
			const formatted = userRoles.user;
			return <div className="text-left font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'roles',
		header: 'Роли',
	},
	{
		accessorKey: 'command',
		header: '',
		cell: ({ row }) => {
			const userRoles = row.original;
			const listCommands = userRoles.commands.map((cmd, index) => (
				<Button key={`${cmd.name}-${index}`} variant={cmd.variant} onClick={cmd.action}>
					{cmd.name}
				</Button>
			));

			return <div className="flex justify-end gap-2">{listCommands}</div>;
		},
	},
];
