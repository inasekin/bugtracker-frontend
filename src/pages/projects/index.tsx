import {TabsList, Tabs, TabsContent, TabsTrigger} from "@/components/ui/tabs";
import {ProjectCard} from "@/components/project/project-card";
import {UsersList} from "@/components/project/users-list";
import {VersionsList} from "@/components/project/versions-list";
import {CategoriesList} from "@/components/project/categories-list";

export const ProjectsPage = () => {
    return (
        <Tabs defaultValue="project" className="flex flex-col">
            <TabsList>
                <TabsTrigger value="project">Проект</TabsTrigger>
                <TabsTrigger value="users">Пользователи</TabsTrigger>
                <TabsTrigger value="versions">Версии</TabsTrigger>
                <TabsTrigger value="categories">Категории</TabsTrigger>
            </TabsList>
            <TabsContent value="project">
                <ProjectCard />
            </TabsContent>
            <TabsContent value="users">
                <UsersList />
            </TabsContent>
            <TabsContent value="versions">
                <VersionsList />
            </TabsContent>
            <TabsContent value="categories">
                <CategoriesList />
            </TabsContent>
        </Tabs>
    )
}
