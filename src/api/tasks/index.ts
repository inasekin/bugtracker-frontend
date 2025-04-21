import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//const API_URL = 'http://localhost:5000';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'task' | 'bug' | 'feature';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type User = {
  id: string;
  name: string;
  avatar?: string;
};

export type TaskDto = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  projectId: string;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  files?: File[];
};

// Временные моковые данные для задач, пока нет API
const mockUsers: User[] = [
  { id: '1', name: 'Анна Смирнова', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', name: 'Иван Петров', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', name: 'Ольга Кузнецова', avatar: 'https://i.pravatar.cc/150?img=9' }
];

const mockTasks: TaskDto[] = [
  {
    id: 'TASK-1',
    title: 'Создать дизайн главной страницы',
    description: 'Разработать современный дизайн для главной страницы приложения',
    status: 'in_progress',
    priority: 'high',
    type: 'task',
    projectId: '1',
    assigneeId: '1',
    assignee: mockUsers[0],
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-02T14:30:00Z',
    dueDate: '2023-10-10T23:59:59Z'
  },
  {
    id: 'TASK-2',
    title: 'Исправить баг в авторизации',
    description: 'Пользователи сообщают о проблемах при входе в систему',
    status: 'todo',
    priority: 'critical',
    type: 'bug',
    projectId: '1',
    assigneeId: '2',
    assignee: mockUsers[1],
    createdAt: '2023-10-03T09:15:00Z',
    updatedAt: '2023-10-03T09:15:00Z',
    dueDate: '2023-10-05T23:59:59Z'
  },
  {
    id: 'TASK-3',
    title: 'Добавить страницу профиля',
    description: 'Создать страницу с информацией о пользователе и возможностью редактирования',
    status: 'review',
    priority: 'medium',
    type: 'feature',
    projectId: '2',
    assigneeId: '3',
    assignee: mockUsers[2],
    createdAt: '2023-09-28T11:20:00Z',
    updatedAt: '2023-10-04T16:45:00Z',
    dueDate: '2023-10-12T23:59:59Z'
  },
  {
    id: 'TASK-4',
    title: 'Оптимизировать загрузку изображений',
    description: 'Улучшить производительность при загрузке изображений в галерее',
    status: 'done',
    priority: 'low',
    type: 'task',
    projectId: '2',
    assigneeId: '1',
    assignee: mockUsers[0],
    createdAt: '2023-09-25T13:30:00Z',
    updatedAt: '2023-10-03T10:25:00Z',
    dueDate: undefined
  }
];

export function useTasks(projectId?: string, refreshId: string) {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Моковые данные - потом заменим на реальный API
        /*
        setTimeout(() => {
          let filteredTasks = [...mockTasks];
          if (projectId) {
            filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
          }
          setTasks(filteredTasks);
          setLoading(false);
        }, 500);
        */
        // Код для реального API
        const url = `${API_URL}/api/issues${projectId ? `?projectId=${projectId}&refreshId=${refreshId}` : ''}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении задач');
        }

        const data = await response.json();
        setTasks(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении задач');
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, refreshId]);

  return { tasks, loading, error };
}

/*
export const GetDefaultTaskDto = (projectId: string, userId: string) : TaskDto => {
  return {
    id: "",
    title: "Новая задача",
    description: "",
    status: "todo",
    priority: "medium",
    type: "feature",
    projectId: projectId,
    assigneeId?: userId,
  } as TaskDto;
};
*/
export function useTask(taskId?: string) {
  const [task, setTask] = useState<TaskDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      /*setTask({
        id: "",
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        type: "feature",
        projectId: "",
        assigneeId: "",
      } as TaskDto);*/
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);

        // Моковые данные - потом заменим на реальный API
        /*
        setTimeout(() => {
          const foundTask = mockTasks.find(task => task.id === taskId);
          if (foundTask) {
            setTask(foundTask);
          } else {
            setError('Задача не найдена');
          }
          setLoading(false);
        }, 500);*/

        // Код для реального API
        const refreshId = Date.now(); // Кэширование настолько крутое в прокси, что даже put/post запросы не пропускает
        const response = await fetch(`${API_URL}/api/issues/${taskId}?refreshId=${refreshId}`, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении задачи');
        }

        const data = await response.json();
        setTask(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении задачи');
        
      }
      finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const updateTask = async (updatedTask: TaskDto) => {
    try {
      setLoading(true);
      const refreshId = Date.now(); // Кэширование настолько крутое в прокси, что даже put/post запросы не пропускает
      console.log("update: " + `${API_URL}/api/issues${taskId ? `/${taskId}` : ''}?refreshId=${refreshId}`);
      const response = await fetch(`${API_URL}/api/issues${taskId ? `/${taskId}` : ''}?refreshId=${refreshId}`, {
        method: taskId ? "PUT" : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
      }

      if(taskId) 
      {
        // PUT метод не возвращает ничего, поэтому будет ошибка на response.json()
        return { success: true, updatedTask };
      }
      else
      {
        // Если создали новый объект, то вернёт объект с id
        const data = await response.json();
        setTask(data);
        return { success: true, data };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении проекта';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!taskId) {
      return { success: false, error: 'ID задачи не указан' };
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/issues/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении проекта');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении проекта';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { task, setTask, loading, error, updateTask, deleteTask };
}
