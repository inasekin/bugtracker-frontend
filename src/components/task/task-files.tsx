import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { File } from "@/api/files"

export type TaskFilesProps = {
    taskId: string,
    oldFiles?: File[];
    files: any,
    setFiles: any
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//const API_URL = 'http://localhost:5005';

export const TaskFiles = ({ taskId, files, setFiles, oldFiles} : TaskFilesProps) => {

    function handleMultipleChange(event) {
        setFiles([...event.target.files]);
    }

    const oldFileList = [];
    if(oldFiles)
        oldFiles.forEach(file => {
            const url = API_URL + "/api/files/show/" + file.id;
            oldFileList.push((<div key={file.id}>
                <a href={url} target="_blank">
                {file.name}
                </a>
            </div>));
    });

    return (
        <Card>
            <CardHeader>
                Файлы:
            </CardHeader>
            <CardContent>
                <div>
                    {oldFileList}
                </div>
                
                <div></div>
                <div className="m-2">Добавить файлы: </div>
                <Input id="picture" type="file" multiple onChange={handleMultipleChange} />
            </CardContent>
        </Card>
    );
};
