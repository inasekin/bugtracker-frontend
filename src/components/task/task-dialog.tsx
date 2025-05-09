import {Button} from "@/components/ui/button"
import {useNavigate} from "react-router-dom";
import { useProject } from "@/api/projects";
import { useCurrent } from "@/api/auth/use-current";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TaskDto, TaskType, useTask } from "@/api/tasks";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TaskComments } from "./task-comments";
import { TaskFiles } from "./task-files";
import { useState } from "react";
import { uploadFilesAsync } from "@/api/files";

export type TaskDialogProps = {
    taskId?: string,
    projectId: string,
    onClosed: () => void
};

export const TaskDialog = ({ taskId, projectId, onClosed } : TaskDialogProps) => {

    const project = useProject(projectId);
    const { data, isError } = useCurrent();
    const userId = data.payload.id;    
    
    // const users = useFetch<UserDto[]>('/api/user');

    const isNewTask = taskId ? false : true;
    const {
        task,
        setTask,
        loading,
        error,
        updateTask,
        deleteTask
    } = useTask(isNewTask ? undefined : taskId);

    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    const taskTypeList = [
        { name: 'task', description: 'Задача'},
        { name: 'bug', description: 'Ошибка'},
        { name: 'feature', description: 'Предложение'}
    ].map((u)=>(
        <SelectItem value={u.name}>{u.description}</SelectItem>
    ));

    const taskPrioritiesList = [
        { name: 'low', description: 'Низкий'},
        { name: 'medium', description: 'Обычный'},
        { name: 'high', description: 'Высокий'},
        { name: 'critical', description: 'Блокирующий'}
    ].map((u)=>(
        <SelectItem value={u.name}>{u.description}</SelectItem>
    ));

    const taskStatusesList = [
        { name: 'todo', description: 'К выполнению'},
        { name: 'in_progress', description: 'В работе'},
        { name: 'review', description: 'Ревью'},
        { name: 'done', description: 'Выполнено'}
    ].map((u)=>(
        <SelectItem value={u.name}>{u.description}</SelectItem>
    ));

    const handleSave = async () => {
        try {
            if(!(task?.description)) {
                alert("Не заполнено описание");
                return;
            }

            const uploadedFiles = await uploadFilesAsync(files);
            let taskFiles = task.files != null ? task.files : [];
            taskFiles = taskFiles.concat(uploadedFiles);

            const taskProject = {...task, projectId: projectId, files: taskFiles } as TaskDto;
            const result = await updateTask(taskProject as TaskDto);
            if (result.success) {
                onClosed();
            } else {
                console.error("Ошибка при сохранении проекта", result.error);
            }
        }
        catch(err) {
            console.error("Ошибка при сохранении проекта Catch:", err);            
        }
    };

    if (loading && !isNewTask) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center">
                        <p className="text-slate-500">Загрузка данных задачи...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !isNewTask) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center text-red-500">
                        <p>Ошибка: {error}</p>
                        <Button
                            onClick={() => navigate('/tasks')}
                            className="mt-4"
                            variant="outline"
                        >
                            Вернуться к списку задач
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle>
                        {isNewTask ? 'Создание новой задачи' : `Редактирование задачи: ${task?.title}`}
            </CardTitle>
            <CardDescription>
                Задача для проекта {project?.project?.name}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={e => { e.preventDefault(); }} className="space-y-4">
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="name">Тема</Label>
                        <Input id="name" placeholder="Укажите тему задачи" value={task?.title} onChange={e => setTask({...task as TaskDto, title: e.target.value})}  />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="description">Описание</Label>
                        <Textarea value={task?.description} onChange={e => setTask({...task as TaskDto, description: e.target.value})} />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="itemId">TaskId: {task?.id}</Label>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label htmlFor="parentProject">Тип</Label>
                    <Select onValueChange={(t)=>setTask({...task, type: t})} defaultValue={task ? task.type : "task"}>
                    <SelectTrigger id="framework1">
                        <SelectValue placeholder="Укажите тип задачи" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        {taskTypeList}
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label htmlFor="parentProject">Приоритет</Label>
                    <Select onValueChange={(p)=>setTask({...task, priority: p})} defaultValue={task ? task.priority : "medium"}>
                    <SelectTrigger id="framework1">
                        <SelectValue placeholder="Укажите приоритет" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        {taskPrioritiesList}
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label htmlFor="parentProject">Статус</Label>
                    <Select onValueChange={(s)=>setTask({...task, status: s})} defaultValue={task ? task.status : "todo"}>
                    <SelectTrigger id="framework1">
                        <SelectValue placeholder="Укажите статус" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        {taskStatusesList}
                    </SelectContent>
                    </Select>
                </div>

                {<TaskFiles taskId={task?.id as string} files={files} setFiles={setFiles} oldFiles={task?.files}></TaskFiles>}

                <Button id="saveButton" onClick={handleSave}>Сохранить</Button>
                <Button id="back" onClick={() => onClosed()} variant="outline">Отмена</Button>

                {!isNewTask && <TaskComments taskId={task?.id as string} userId={userId}></TaskComments>}
                
            </form>
            </CardContent>
            <CardFooter className="flex items-start gap-4">
            </CardFooter>
        </Card>
    );
};
