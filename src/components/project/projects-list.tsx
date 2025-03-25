import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useProjects } from "@/api/projects"

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

function mapProjectsToRecords(projects: any[]): ProjectRecord[] {
  if (!projects || !Array.isArray(projects)) {
    return [];
  }
  
  return projects.map(project => ({
    id: project.id,
    name: project.name,
    url: `/projects/${project.id}`,
    description: project.description,
    command: "Редактировать"
  }));
}

export function ProjectsList() {
  const { projects, loading, error } = useProjects();
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/projects?command=new');
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
      		{loading ? (
      			<div className="text-center py-8">
      				<p className="text-slate-500">Загрузка проектов...</p>
      			</div>
      		) : error ? (
      			<div className="text-center py-8 text-red-500">
      				<p>Ошибка: {error}</p>
      			</div>
      		) : (
      			<DataTable columns={columns} data={mapProjectsToRecords(projects)} />
      		)}
	      </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button id="addProject" onClick={handleNewProject}>Новый проект...</Button>
        <Button id="back" onClick={() => history.back()} variant="outline">Назад</Button>
      </CardFooter>
    </Card>
  )
}
