import {useParams, useSearchParams} from 'react-router-dom';
import {ProjectsList} from "@/components/project/projects-list";
import {ProjectDialog} from "../../components/project/project-dialog";

export const ProjectsPage = () => {

    const params = useParams();
    const projectId = params.id;
    
    const isNewProject = params.id == "new";

    const [searchParams] = useSearchParams();
    const isDeleteProject = searchParams.has("delete");
        
    if(projectId)
    {
        return (
            <ProjectDialog projectId={projectId} isDeleteProject={isDeleteProject} isNewProject={isNewProject}/>
        )
    }
    else
    {
        return (
            <ProjectsList />
        )
    }
}
