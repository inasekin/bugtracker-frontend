import { Button } from "@/components/ui/button"
import { useContext, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserRoleDictionary } from "./data/project-dto"
import { UserRolesRecord, columns } from "@/components/project/project-tables/user-columns.tsx"
import { DataTable } from "@/components/project/project-tables/data-table"
import {ProjectContext} from "./data/project-context"
import { ProjectAddUserDialog, UserRole } from "./project-add-user-card"
import { toast } from 'react-toastify';

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

export type ItemAction = (record: string) => any;

function userRolesFromProject(userRolesDto: UserRoleDictionary, editAction: ItemAction, deleteAction: ItemAction): UserRolesRecord[] {
  if(userRolesDto == null)
    return {} as UserRolesRecord[];
   
  const userRoles = new Array<UserRolesRecord>();
  for (let key in userRolesDto) {
    userRoles.push({
      id: key,
      user: key,
      roles: userRolesDto[key].join(','),
      commands: [{
          name: "Редактировать",
          variant:"secondary",
          action: (e) => editAction(key)
        }, {
          name: "Удалить",
          variant:"destructive",
          action: (e) => deleteAction(key)          
        }]
    } as UserRolesRecord);
  }
  return userRoles;
}

export function UsersList() {

  const { project, setProject } = useContext(ProjectContext);
  const [ userRole, setUserRole ] = useState({} as UserRole);
  const [ userRoleDlgShowed, setUserRoleDlgShowed ] = useState(false);

  const addUser = () => {
    if(!userRole.userName){
      toast.error("Не выбран пользователь");
      return;
    }
    let newProject = {...project};
    newProject.userRoles = {...newProject.userRoles};
    newProject.userRoles[userRole.userName] = userRole.userRoles ? userRole.userRoles.split(',') : [];
    setProject(newProject);
    setUserRoleDlgShowed(false);
  };

  const editUser = (userName: string) => {

    const roles = project.userRoles[userName];
    const userRole = {
      userId: userName,
      userName: userName,
      userRoles: roles.join(',')
    } as UserRole;
    setUserRole(userRole);
    setUserRoleDlgShowed(true);
  };

  const deleteUser = (userName:string) => {
    let newProject = {...project};
    newProject.userRoles = {...newProject.userRoles};
    delete newProject.userRoles[userName];
    setProject(newProject);
  };

  const showAddUserDlg = () => {
    setUserRole({} as UserRole);
    setUserRoleDlgShowed(true);
  };

  if(userRoleDlgShowed) {
    return (
      <div>
        <ProjectAddUserDialog userRole={userRole} setUserRole={setUserRole}></ProjectAddUserDialog>
        <br />
        <Button onClick={()=> addUser()}>Добавить</Button> 
        <Button onClick={()=> setUserRoleDlgShowed(false)}>Отмена</Button>
      </div>
    )
  }
  else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Участники проекта</CardTitle>
          <CardDescription className="my-2">Для проекта необходимо указать участников и задать роли. <br />Исходя из указанных ролей будут назначены заранее определенные права доступа.</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="container mx-auto ">
            <DataTable columns={columns} data={ userRolesFromProject(project.userRoles, editUser, deleteUser)} />
        </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button id="addUser" onClick={()=> showAddUserDlg()}>Добавить участника...</Button>
        </CardFooter>
      </Card>
    )
  }
}
