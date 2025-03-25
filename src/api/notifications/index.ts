import { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export type NotificationDto = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: NotificationType;
  read: boolean;
};

// Моковые данные для уведомлений
const mockNotifications: NotificationDto[] = [
  {
    id: '1',
    title: 'Новая задача',
    message: 'Вам назначена новая задача "Разработать API для проектов"',
    createdAt: '2023-10-05T10:30:00Z',
    type: 'info',
    read: false
  },
  {
    id: '2',
    title: 'Внимание! Дедлайн',
    message: 'Срок выполнения задачи "Обновить дизайн" истекает через 2 дня',
    createdAt: '2023-10-04T16:45:00Z',
    type: 'warning',
    read: false
  },
  {
    id: '3',
    title: 'Завершение проекта',
    message: 'Проект "Бэкенд для платежной системы" успешно завершен',
    createdAt: '2023-10-03T14:20:00Z',
    type: 'success',
    read: true
  },
  {
    id: '4',
    title: 'Ошибка в приложении',
    message: 'Зафиксирована критическая ошибка в модуле авторизации',
    createdAt: '2023-10-02T09:15:00Z',
    type: 'error',
    read: true
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Моковые данные - потом заменим на реальный API
        setTimeout(() => {
          setNotifications(mockNotifications);
          setLoading(false);
        }, 500);

        /*
        // Код для реального API
        const response = await fetch(`${API_URL}/api/notifications`, {
          method: "GET",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении уведомлений');
        }

        const data = await response.json();
        setNotifications(data);
        */
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении уведомлений');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      // Моковые данные - потом заменим на реальный API
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      /*
      // Код для реального API
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении уведомления');
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      */

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении уведомления');
      return { success: false, error };
    }
  };

  const markAllAsRead = async () => {
    try {
      // Моковые данные - потом заменим на реальный API
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );

      /*
      // Код для реального API
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: "PATCH",
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении уведомлений');
      }

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      */

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении уведомлений');
      return { success: false, error };
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
}
