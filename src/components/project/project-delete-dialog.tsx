import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProjectDialogProps } from "./project-dialog";
import { useProject } from "@/api/projects";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const ProjectDeleteDialog = ({ projectId }: ProjectDialogProps) => {
    const navigate = useNavigate();
    const {
        project,
        loading,
        error,
        deleteProject
    } = useProject(projectId);

    const handleDelete = async () => {
        try {
            const result = await deleteProject();

            if (result.success) {
                navigate('/projects');
            } else {
                console.error("Ошибка при удалении проекта", result.error);
            }
        } catch (err) {
            console.error("Ошибка при удалении проекта", err);
        }
    };

    if (loading) {
        return (
            <Card className="w-fit">
                <CardContent className="py-10">
                    <div className="text-center">
                        <p className="text-slate-500">Загрузка данных проекта...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-fit">
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
        <Card className="w-fit">
            <CardHeader>
                <CardTitle>Удаление проекта</CardTitle>
                <CardDescription>
                    Вы уверены, что хотите удалить проект?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="font-semibold text-lg">{project.name}</div>
                <div className="text-slate-500 mt-2">{project.description}</div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button
                    id="deleteCmd"
                    onClick={handleDelete}
                    variant="destructive"
                >
                    Да, удалить
                </Button>
                <Button
                    id="back"
                    onClick={() => navigate('/projects')}
                    variant="outline"
                >
                    Отмена
                </Button>
            </CardFooter>
        </Card>
    );
};
