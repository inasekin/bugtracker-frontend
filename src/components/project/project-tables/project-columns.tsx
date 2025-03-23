import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

export type ProjectRecord = {
  id: string,
  name: string,
  description: string,
  url: string,
  command: string,
}

export const columns: ColumnDef<ProjectRecord>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Проект</div>,
    cell: ({ row }) => {
      const formatted = row.original.name;
      const url = row.original.url;
      return <div className="text-left font-medium"><a href={url}>{formatted}</a></div>
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
      const itemId = row.original.id;
      return (<div className="flex justify-end gap-2">
	      <Button variant="secondary"><Link to={itemId}>{command}</Link></Button>
	      <Button variant="destructive"><Link to={itemId+"?delete"}>Удалить</Link></Button>
      </div>);
    }
  },
];
