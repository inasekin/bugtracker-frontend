import { Button } from "@/components/ui/button"
import { useFetch } from "./data/use-fetch"
import { ProjectDto } from "./data/project-dto"
import { useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProjectRecord, columns } from "@/components/project/project-tables/project-columns.tsx"

import { DataTable } from "@/components/project/project-tables/data-table"

function getData(): ProjectRecord[] {
  return [
    {
      id: "1",
      name: "Тест",
      description: "Тестовый проект",
      url: '/test',
      command: "Редактировать"
    }
  ];
}

function fromJson(json: any): ProjectRecord[] {
  if(json == null)
    return {} as ProjectRecord[];
  let result = (json as Array<ProjectRecord>).map(val => { 
    return {
      id: val.id,
      name: val.name,
      url: '/projects/' + val.id,
      description: val.description,
      command: "Редактировать"
    }
  }) as ProjectRecord[];
  return result;
}



export function ProjectsList() {

  //const data = getData();
  const data = useFetch<ProjectDto>('/api/project');
  const navigate = useNavigate();

  const newProject = () => {
    navigate('/projects/new')
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Проекты</CardTitle>
        <CardDescription className="my-2">Проект - базовая сущность. <br />
          Задачи группируются по проектам. Проект имеет версии. Настраиваются права доступа и категории.
	      </CardDescription>
      </CardHeader>
      <CardContent>
      	<div className="container mx-auto ">
      		<DataTable columns={columns} data={fromJson(data)} />
	      </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button id="addProject" onClick={()=> newProject() }>Новый проект...</Button>
        <Button id="back" onClick={ ()=> history.back() }>Назад</Button>
      </CardFooter>
    </Card>
  )
}
