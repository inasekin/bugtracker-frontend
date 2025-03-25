import { Link } from "react-router-dom";
import { useProjects } from "@/api/projects";
import { useTasks } from "@/api/tasks";
import { useNotifications } from "@/api/notifications";
import { TaskCard } from "./task-card";
import { ProjectCard } from "./project-card";
import { NotificationCard } from "./notification-card";
import { formatRelativeTime } from "@/lib/format-date";

export function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const { 
    notifications, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead,
    unreadCount
  } = useNotifications();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Блок с задачами */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Мои задачи</h2>
            <Link 
              to="/tasks" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Все задачи
            </Link>
          </div>
          
          <div className="space-y-3">
            {tasksLoading ? (
              <div className="text-center py-4">
                <p className="text-slate-500">Загрузка задач...</p>
              </div>
            ) : tasks && tasks.length > 0 ? (
              tasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  priority={task.priority}
                  type={task.type}
                  assignee={task.assignee}
                />
              ))
            ) : (
              <div className="text-center py-4 border rounded-md">
                <p className="text-slate-500">Нет активных задач</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Блок с проектами */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Проекты</h2>
            <Link 
              to="/projects" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Все проекты
            </Link>
          </div>
          
          <div className="space-y-3">
            {projectsLoading ? (
              <div className="text-center py-4">
                <p className="text-slate-500">Загрузка проектов...</p>
              </div>
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 3).map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-4 border rounded-md">
                <p className="text-slate-500">Нет доступных проектов</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Блок с уведомлениями */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Уведомления</h2>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Прочитать все
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {notificationsLoading ? (
              <div className="text-center py-4">
                <p className="text-slate-500">Загрузка уведомлений...</p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.slice(0, 5).map(notification => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  message={notification.message}
                  time={formatRelativeTime(new Date(notification.createdAt))}
                  type={notification.type}
                  read={notification.read}
                  onClick={() => handleNotificationClick(notification.id)}
                />
              ))
            ) : (
              <div className="text-center py-4 border rounded-md">
                <p className="text-slate-500">Нет новых уведомлений</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 