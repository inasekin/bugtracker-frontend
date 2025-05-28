import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskType } from '@/types/common';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Переименовываем TaskDto в Task (используем общий тип)
export type { Task as TaskDto, TaskStatus, TaskPriority, TaskType };

export function useTasks(projectId?: string, refreshId?: string) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				setLoading(true);
				const finalRefreshId = refreshId || Date.now().toString();

				const url = projectId
					? `${API_URL}/api/issues?projectId=${projectId}&refreshId=${finalRefreshId}`
					: `${API_URL}/api/issues?refreshId=${finalRefreshId}`;

				const response = await fetch(url, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
				});

				if (!response.ok) {
					throw new Error('Ошибка при получении задач');
				}

				const data = await response.json();
				setTasks(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка при получении задач');
			} finally {
				setLoading(false);
			}
		};

		fetchTasks();
	}, [projectId, refreshId]);

	return { tasks, loading, error };
}

export function useTask(taskId?: string) {
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!taskId) {
			setLoading(false);
			return;
		}

		const fetchTask = async () => {
			try {
				setLoading(true);
				const refreshId = Date.now();
				const response = await fetch(
					`${API_URL}/api/issues/${taskId}?refreshId=${refreshId}`,
					{
						method: 'GET',
						credentials: 'include',
						mode: 'cors',
					},
				);

				if (!response.ok) {
					throw new Error('Ошибка при получении задачи');
				}

				const data = await response.json();
				setTask(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка при получении задачи');
			} finally {
				setLoading(false);
			}
		};

		fetchTask();
	}, [taskId]);

	const updateTask = async (updatedTask: Task) => {
		try {
			setLoading(true);
			const refreshId = Date.now();
			const response = await fetch(
				`${API_URL}/api/issues${taskId ? `/${taskId}` : ''}?refreshId=${refreshId}`,
				{
					method: taskId ? 'PUT' : 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					mode: 'cors',
					credentials: 'include',
					body: JSON.stringify(updatedTask),
				},
			);

			if (!response.ok) {
				throw new Error('Ошибка при обновлении задачи');
			}

			if (taskId) {
				return { success: true, updatedTask };
			} else {
				const data = await response.json();
				setTask(data);
				return { success: true, data };
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ошибка при обновлении задачи';
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
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors',
			});

			if (!response.ok) {
				throw new Error('Ошибка при удалении задачи');
			}

			return { success: true };
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении задачи';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	};

	return { task, setTask, loading, error, updateTask, deleteTask };
}
