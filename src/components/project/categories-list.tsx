import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CategoryRecord, columns } from "@/components/project/project-tables/categories-columns.tsx"
import { DataTable } from "@/components/project/project-tables/data-table"
import { ProjectAddCategoryDialog } from "@/components/project/project-add-category-dlg"
import { useContext, useState } from "react"
import {ProjectContext} from "./data/project-context"

/*
function getData(): CategoryRecord[] {
  return [
    {
      id: "1",
      category: "Проекты",
      assigned: "Алексей М.",
      command: "Редактировать",
    },
    {
      id: "2",
      category: "Комментарии",
      assigned: "Артём П.",
      command: "Редактировать",
    },
    {
      id: "3",
      category: "Пользователи/Группы",
      assigned: "Иван Н.",
      command: "Редактировать",
    },
    {
      id: "4",
      category: "Уведомления",
      assigned: "Павел С.",
      command: "Редактировать",
    },
    {
      id: "5",
      category: "Файлы",
      assigned: "Вадим C.",
      command: "Редактировать",
    },
    {
      id: "6",
      category: "Задачи",
      assigned: "Александр Н.",
      command: "Редактировать",
    }
  ];
}*/

export type ItemAction = (record: string) => any;
function categoriesFromProject(categoriesDto: IssueCategoryDto[], editAction: ItemAction, deleteAction: ItemAction): CategoryRecord[] {
  if(categoriesDto == null)
    return {} as IssueCategoryDto[];
   
  const categories = new Array<CategoryRecord>();
  categoriesDto.forEach(item => {
    categories.push({
      id: item.categoryName,
      category: item.categoryName,
      assigned: item.userId,
      commands: [{
        name: "Редактировать",
        variant:"secondary",
        action: (e) => editAction(item)
      }, {
        name: "Удалить",
        variant:"destructive",
        action: (e) => deleteAction(item)          
      }]        
    } as CategoryRecord);
  });
  return categories;
}

export function CategoriesList() {

  const { project, setProject } = useContext(ProjectContext);
  const [ category, setCategory ] = useState({ categoryName: '' } as IssueCategoryDto);
  const [ prevCategory, setPrevCategory ] = useState('');
  const [ dlgShowed, setDlgShowed ] = useState(false);

  const addCategory = () => {
    let newProject = {...project};
    newProject.issueCategories = [...newProject.issueCategories];
    const index = project.issueCategories.indexOf(prevCategory, 0);
    if (index > -1)
      newProject.issueCategories[index] = {...category};  
    else
      newProject.issueCategories.push(category);
    setProject(newProject);
    setDlgShowed(false);
  };

  const editCategory = (name: string) => {
    const index = project.issueCategories.indexOf(name, 0);
    if (index > -1) { 
      const cat = project.issueCategories[index];
      setCategory({
        ...cat
      } as IssueCategoryDto);
    }
    setPrevCategory(name);
    setDlgShowed(true);
  };

  const deleteCategory = (name:string) => {
    let newProject = {...project};
    newProject.issueCategories = [...newProject.issueCategories];

    const index = newProject.issueCategories.indexOf(name, 0);
    if (index > -1) 
      newProject.issueCategories.splice(index, 1);
    
    setProject(newProject);
  };

  const showDlg = () => {
    setCategory({
      categoryName: ''
    } as IssueCategoryDto);
    setPrevCategory('');
    setDlgShowed(true);
  };

  if(dlgShowed) {
    return (
      <div>
        <ProjectAddCategoryDialog category={category} setCategory={setCategory}></ProjectAddCategoryDialog>
        <br />
        <Button onClick={()=> addCategory()}>Добавить</Button> 
        <Button onClick={()=> setDlgShowed(false)}>Отмена</Button>
      </div>
    )
  }
  else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Категории задач</CardTitle>
          <CardDescription className="my-2">Каждый проект разбивается на категории(модули/микросервисы).<br />
    Каждой категории назначается один ответственный на которого отправляются задачи относящиеся к категории.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="container mx-auto ">
            <DataTable columns={columns} data={ categoriesFromProject(project.issueCategories,editCategory,deleteCategory)} />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
        <Button id="add" onClick={()=> showDlg()}>Добавить категорию...</Button>
        </CardFooter>
      </Card>
    )
  }
}

