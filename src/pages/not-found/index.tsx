import {Link} from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const NotFoundPage = () => {
    return (
        <div className="h-screen flex items-center justify-center flex-col gap-y-4">
            <AlertTriangle className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Что-то пошло не так</p>
            <Button variant="secondary" size="sm">
                <Link to="/">Вернуться на главную</Link>
            </Button>
        </div>
    );
};
