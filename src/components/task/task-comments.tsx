import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card"
import {
    Button
} from "@/components/ui/button"
import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label'

export type TaskCommentsProps = {
    taskId: string
};

export type TaskComment = {
    description: string,
    taskId: string
};

export const TaskComments = ({ taskId } : TaskCommentsProps) => {

    // TODO: по аналогии с проектами useProjects
    // const comments = useComments(taskId); 

    return (
        <Card>
            <CardHeader>
                Комментарии:
            </CardHeader>
            <CardContent>
                <div className="p-2">TODO: Добавить список комментариев сюда для задачи {taskId}</div>
                <div className="flex flex-col space-y-4 m-2">
                    <Label htmlFor="description">Новый комментарий</Label>
                    <Textarea />
                </div>                
                <Button className="m-2" onClick={() => alert("TODO") }>Добавить комментарий...</Button>
            </CardContent>
        </Card>
    );
};
