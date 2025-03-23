import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx";

export type CategoryRecord = {
  id: string,
  category: string,
  assigned: string
  command: string
}

export const columns: ColumnDef<CategoryRecord>[] = [
  {
    accessorKey: "category",
    header: () => <div className="text-left">Категория задачи</div>,
    cell: ({ row }) => {
      const formatted = row.original.category;
      return <div className="text-left font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "assigned",
    header: "Назначена",
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
