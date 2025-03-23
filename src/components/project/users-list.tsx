import { Button } from "@/components/ui/button"
import { useFetch } from "@/components/project/data/use-fetch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserRolesRecord, columns } from "@/components/project/project-tables/user-columns.tsx"
import { DataTable } from "@/components/project/project-tables/data-table"

/*
function getData(): UserRolesRecord[] {
  return [
    {
      id: "1",
      user: "Вадим С.",
      roles: "Разработчик, Тестировщик, Руководитель проекта",
      command: "Редактировать",
    },
    {
      id: "2",
      user: "Иван Н.",
      roles: "Разработчик, Тестировщик, DevOps",
      command: "Редактировать",
    },
    {
      id: "3",
      user: "Артём П.",
      roles: "Разработчик, Тестировщик",
      command: "Редактировать",
    },
    {
      id: "4",
      user: "Павел С.",
      roles: "Разработчик, Тестировщик",
      command: "Редактировать",
    },
    {
      id: "5",
      user: "Алексей М.",
      roles: "Разработчик, Тестировщик",
      command: "Редактировать",
    },
    {
      id: "6",
      user: "Александр Н.",
      roles: "Покинул проект",
      command: "Редактировать",
    }
  ];
}*/

export type UserRecord = {
  id: string
  name: string
  email: string
}

function userRolesFromJson(json: any): UserRolesRecord[] {

  if(json == null)
    return {} as UserRolesRecord[];
   
  let userRoles = (json as Array<UserRecord>).map(val => { 
    return {
      id: val.id,
      user: val.name,
      roles: val.email,
      command: "Редактировать"
    }
  }) as UserRolesRecord[];

  return userRoles;
}

export function UsersList() {

  //const data = useFetch('/api/project');
  const data = useFetch('/api/user');
 
  //const data = getData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Участники проекта</CardTitle>
        <CardDescription className="my-2">Для проекта необходимо указать участников и задать роли. <br />Исходя из указанных ролей будут назначены заранее определенные права доступа.</CardDescription>
      </CardHeader>
      <CardContent>

    	<div className="container mx-auto ">
      		<DataTable columns={columns} data={userRolesFromJson(data)} />
	    </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button id="addUser">Добавить участника...</Button>
        <Button id="back" onClick={ ()=> history.back() }>Назад</Button>
      </CardFooter>
    </Card>
  )
}
