import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card"
import {
    Button
} from "@/components/ui/button"

export type TaskFilesProps = {
    taskId: string
};

export const TaskFiles = ({ taskId } : TaskFilesProps) => {

    // TODO: по аналогии с проектами useProjects
    // const comments = useComments(taskId); 

    return (
        <Card>
            <CardHeader>
                Файлы:
            </CardHeader>
            <CardContent>
                <div>TODO: Добавить добавление файлов для задачи {taskId}</div>
                <Button className="m-2" onClick={() => alert("TODO") }>Добавить файл...</Button>
            </CardContent>
        </Card>
    );
};
