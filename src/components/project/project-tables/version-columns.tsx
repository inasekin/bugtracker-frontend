import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx";

export type VersionRecord = {
  id: string,
  version: string,
  description: string,
  command: string,
}

export const columns: ColumnDef<VersionRecord>[] = [
  {
    accessorKey: "version",
    header: () => <div className="text-left">Версия</div>,
    cell: ({ row }) => {
      const formatted = row.original.version;
      return <div className="text-left font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Описание</div>,
  },
  {
    accessorKey: "command",
    header: "",
    cell: ({ row }) => {
      const command = row.original.command;
      return (<div className="flex justify-end gap-2">
	      <Button variant="secondary">{command}</Button>
	      <Button variant="destructive">Удалить</Button>
      </div>);
    }
  },
];
