import {TabsList, Tabs, TabsContent, TabsTrigger} from "@/components/ui/tabs";
import {ProjectCard} from "@/components/project/project-card";
import {UsersList} from "@/components/project/users-list";
import {VersionsList} from "@/components/project/versions-list";
import {CategoriesList} from "@/components/project/categories-list";
import {Button} from "@/components/ui/button"
import {ProjectDto, defaultProjectDto} from "./data/project-dto"
import {ProjectContext} from "./data/project-context"
import {useNavigate} from "react-router-dom";
import {useFetchState} from "./data/use-fetch";
import {useState} from "react"
import {putData, postData, deleteData} from "./data/fetch-data";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export type ProjectDialogProps = {
    projectId: string;
    isNewProject?: boolean;
    isDeleteProject?: boolean;
};

export const ProjectDialog = ({projectId, isNewProject, isDeleteProject} : ProjectDialogProps) => {

    const [data, setData] = isNewProject ? useState(defaultProjectDto) :  useFetchState<ProjectDto>('/api/project/' + projectId, defaultProjectDto)
    const navigate = useNavigate();

    if(isDeleteProject)
    {
       const navigate = useNavigate();
        
        const deleteCmd = async () => {
            await deleteData('/api/project/' + projectId);
            navigate('/projects', { state: {} });
        };
    
        return (
            <Card className="w-fit">
            <CardHeader>
            <CardTitle>Удаление проекта</CardTitle>
            <CardDescription>
                Вы уверены, что хотите удалить проект?
            </CardDescription>
            </CardHeader>
            <CardContent>
            {data.name}
            </CardContent>
                <CardFooter className="flex justify-center  gap-4">
                <Button id="deleteCmd" onClick={ () => deleteCmd() }>Да</Button>
                <Button id="back" onClick={ ()=>  navigate('/projects') }>Нет</Button>
                </CardFooter>
            </Card>
        )    
    }
    else 
    {
        const save = async () => {
            if(isNewProject)
            {
                await postData('/api/project/', data);
            }
            else {
                await putData('/api/project/' + projectId, data);
            }
            navigate('/projects', { state: {} });
        };
    
        return (
            <ProjectContext.Provider value={{ project: data, setProject: setData }}>
                <Card>
                <CardHeader>
                <CardTitle>Редактирование проекта {data.name}</CardTitle>
                <CardDescription>Проект - основа для управления задачами. Содержит задачи. 
                    На проект назначаются пользователи с определенными ролями. 
                    Для проекта можно задать список версий и список доступных категорий(модулей/подпроектов)</CardDescription>
                </CardHeader>
                <CardContent>

                    <Tabs defaultValue="project" className="flex flex-col items-start">
                        <TabsList>
                            <TabsTrigger value="project">Свойства</TabsTrigger>
                            <TabsTrigger value="users">Пользователи</TabsTrigger>
                            <TabsTrigger value="versions">Версии</TabsTrigger>
                            <TabsTrigger value="categories">Категории</TabsTrigger>
                        </TabsList>
                        <TabsContent value="project" className="w-full">
                            <ProjectCard />
                        </TabsContent>
                        <TabsContent value="users" className="w-full">
                            <UsersList />
                        </TabsContent>
                        <TabsContent value="versions" className="w-full">
                            <VersionsList />
                        </TabsContent>
                        <TabsContent value="categories" className="w-full">
                            <CategoriesList />
                        </TabsContent>
                    </Tabs>

                </CardContent>
                    <CardFooter className="flex items-start gap-4">
                    <Button id="saveButton" onClick={ () => save() }>Сохранить</Button>
                    <Button id="back" onClick={ ()=>  navigate('/projects') }>Отмена</Button>
                    </CardFooter>
                </Card>
            </ProjectContext.Provider>
        )
    }
}
