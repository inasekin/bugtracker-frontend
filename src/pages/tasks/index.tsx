import { useState, useEffect } from 'react';
import { useProjects } from '@/api/projects';
import { useTasks, TaskDto, TaskStatus } from '@/api/tasks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type KanbanColumn = {
  id: TaskStatus;
  title: string;
};

const kanbanColumns: KanbanColumn[] = [
  { id: 'todo', title: 'К выполнению' },
  { id: 'in_progress', title: 'В работе' },
  { id: 'review', title: 'Ревью' },
  { id: 'done', title: 'Выполнено' }
];

export const TasksPage = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { tasks, loading: tasksLoading } = useTasks(selectedProjectId || undefined);
  const [_, setShowTaskForm] = useState(false);

  // Выбираем первый проект автоматически при загрузке проектов
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const groupedTasks: Record<TaskStatus, TaskDto[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: []
  };

  tasks?.forEach(task => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-sky-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-700';
      case 'feature':
        return 'bg-purple-100 text-purple-700';
      case 'task':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddTask = () => {
    if (!selectedProjectId) {
      alert('Пожалуйста, выберите проект перед созданием задачи');
      return;
    }

    setShowTaskForm(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Задачи</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Фильтр
          </Button>
          <Button size="sm" onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Новая задача
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="font-medium text-lg mb-3">Проекты</h2>

            {projectsLoading ? (
              <div className="text-center py-4">
                <p className="text-slate-500">Загрузка проектов...</p>
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-1">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={cn(
                      "cursor-pointer p-2 rounded-md text-sm transition-colors",
                      selectedProjectId === project.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{project.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border rounded-md">
                <p className="text-slate-500">Нет доступных проектов</p>
                <Button className="mt-4" size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать проект
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          {tasksLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Загрузка задач...</p>
            </div>
          ) : selectedProjectId ? (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-xl">
                    {projects?.find(p => p.id === selectedProjectId)?.name || 'Проект'}
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleAddTask}>
                        Создать задачу
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Настройки проекта
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kanbanColumns.map((column) => (
                  <div key={column.id} className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">{column.title}</h3>
                      <div className="flex items-center">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full mr-2">
                          {groupedTasks[column.id].length}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={handleAddTask}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-md p-2 flex-grow min-h-[500px]">
                      {groupedTasks[column.id].length > 0 ? (
                        <div className="space-y-2">
                          {groupedTasks[column.id].map((task) => (
                            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-slate-500">#{task.id}</span>
                                  <div className="flex items-center space-x-1">
                                    <span
                                      className={cn(
                                        "h-2 w-2 rounded-full",
                                        getPriorityColor(task.priority)
                                      )}
                                    />
                                    <span className="text-xs text-slate-500 capitalize">{task.priority}</span>
                                  </div>
                                </div>
                                <h4 className="text-sm font-medium line-clamp-2 mb-2">{task.title}</h4>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-2 py-1 text-xs",
                                      getTypeColor(task.type)
                                    )}
                                  >
                                    {task.type}
                                  </span>

                                  {task.assignee && (
                                    <div className="flex items-center space-x-1">
                                      {task.assignee.avatar ? (
                                        <img
                                          src={task.assignee.avatar}
                                          alt={task.assignee.name}
                                          className="h-5 w-5 rounded-full"
                                        />
                                      ) : (
                                        <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                                          {task.assignee.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-slate-400 text-sm">
                            <p>Нет задач</p>
                            <Button size="sm" variant="ghost" className="mt-2" onClick={handleAddTask}>
                              <Plus className="h-4 w-4 mr-2" />
                              Добавить
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-slate-500">Выберите проект для просмотра задач</p>
            </div>
          )}
        </div>
      </div>

      {/* TODO: Реализовать форму создания задачи */}
    </div>
  );
};
