import {TabsList, Tabs, TabsContent, TabsTrigger} from "@/components/ui/tabs";
import {ProjectCard} from "@/components/project/project-card";
import {UsersList} from "@/components/project/users-list";
import {VersionsList} from "@/components/project/versions-list";
import {CategoriesList} from "@/components/project/categories-list";
import {Button} from "@/components/ui/button"
import {ProjectContext} from "./data/project-context"
import {useNavigate} from "react-router-dom";
import {useEffect} from "react"
import { useProject, defaultProjectDto } from "@/api/projects";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export type ProjectDialogProps = {
    projectId?: string,
    isNewProject?: boolean
};

export const ProjectDialog = ({ projectId, isNewProject }: ProjectDialogProps) => {

    const {
        project,
        setProject,
        loading,
        error,
        updateProject
    } = useProject(isNewProject ? undefined : projectId);

    const navigate = useNavigate();

    useEffect(() => {
        if (isNewProject) {
            setProject(defaultProjectDto);
        }
    }, [isNewProject, setProject]);

    const handleSave = async () => {
        try {
            const result = await updateProject(project);

            if (result.success) {
                navigate('/projects');
            } else {
                console.error("Ошибка при сохранении проекта", result.error);
            }
        } catch (err) {
            console.error("Ошибка при сохранении проекта", err);
        }
    };

    if (loading && !isNewProject) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center">
                        <p className="text-slate-500">Загрузка данных проекта...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !isNewProject) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center text-red-500">
                        <p>Ошибка: {error}</p>
                        <Button
                            onClick={() => navigate('/projects')}
                            className="mt-4"
                            variant="outline"
                        >
                            Вернуться к списку проектов
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            <Card>
            <CardHeader>
            <CardTitle>
                        {isNewProject ? 'Создание нового проекта' : `Редактирование проекта: ${project.name}`}
            </CardTitle>
            <CardDescription>
                Проект - основа для управления задачами. Содержит задачи. 
                На проект назначаются пользователи с определенными ролями. 
                Для проекта можно задать список версий и список доступных категорий (модулей/подпроектов)
            </CardDescription>
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
                <Button id="saveButton" onClick={handleSave}>Сохранить</Button>
                <Button id="back" onClick={() => navigate('/projects')} variant="outline">Отмена</Button>
                </CardFooter>
            </Card>
        </ProjectContext.Provider>
    );
};
