import { VideoRoom } from '../../types/videocall';

// Базовый URL для API из env-переменных
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010';

export const videoCallApi = {
  /**
   * Получить комнату по ID
   */
  async getRoom(roomId: string): Promise<VideoRoom> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/${roomId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка при получении комнаты:', errorText);
      throw new Error('Не удалось получить данные комнаты');
    }
    
    return await response.json();
  },
  
  /**
   * Получить комнату по коду доступа
   */
  async getRoomByCode(accessCode: string): Promise<VideoRoom | null> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/code/${accessCode}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Комната не найдена
      }
      const errorText = await response.text();
      console.error('Ошибка при поиске комнаты по коду:', errorText);
      throw new Error('Не удалось найти комнату по коду');
    }
    
    return await response.json();
  },
  
  /**
   * Получить список комнат пользователя
   */
  async getUserRooms(): Promise<VideoRoom[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка при получении списка комнат:', errorText);
      throw new Error('Не удалось получить список комнат');
    }
    
    return await response.json();
  },
  
  /**
   * Создать новую комнату
   */
  async createRoom(data: { name: string, maxParticipants?: number, isPrivate?: boolean }): Promise<VideoRoom> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Для создания комнаты необходимо авторизоваться');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/videocall/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ошибка при создании комнаты:', errorData);
        
        if (response.status === 401) {
          throw new Error('Для создания комнаты необходимо авторизоваться');
        } else if (response.status === 400) {
          throw new Error(`Ошибка в запросе: ${errorData || 'Проверьте правильность данных'}`);
        } else if (response.status === 500) {
          throw new Error('Ошибка сервера при создании комнаты. Попробуйте позже');
        }
        
        throw new Error(`Не удалось создать комнату (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка при создании комнаты');
    }
  },
  
  /**
   * Присоединиться к комнате
   */
  async joinRoom(roomId: string, username?: string): Promise<VideoRoom> {
    const token = localStorage.getItem('token');
    const data = {
      roomId,
      username: username || ''
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/join`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ошибка при присоединении к комнате:', errorData);
        
        if (response.status === 404) {
          throw new Error('Комната не найдена или была закрыта');
        } else if (response.status === 403) {
          throw new Error('У вас нет доступа к этой комнате');
        } else if (response.status === 400) {
          if (errorData.includes('maximum participants')) {
            throw new Error('Комната заполнена, присоединение невозможно');
          }
          throw new Error(`Ошибка в запросе: ${errorData || 'Проверьте правильность данных'}`);
        } else if (response.status === 401) {
          throw new Error('Требуется авторизация для присоединения к этой комнате');
        } else if (response.status === 500) {
          throw new Error('Ошибка сервера при присоединении к комнате. Попробуйте позже');
        }
        
        throw new Error(`Не удалось присоединиться к комнате (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка при присоединении к комнате');
    }
  },
  
  /**
   * Закрыть комнату
   */
  async closeRoom(roomId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/${roomId}/close`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка при закрытии комнаты:', errorText);
      throw new Error('Не удалось закрыть комнату');
    }
  },
  
  /**
   * Проверка аутентификации пользователя
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  /**
   * Получить список публичных комнат
   */
  async getPublicRooms(): Promise<VideoRoom[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videocall/rooms/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ошибка при получении списка публичных комнат:', errorData);
        
        if (response.status === 500) {
          throw new Error('Ошибка сервера при получении списка комнат. Попробуйте позже');
        }
        
        throw new Error(`Не удалось получить список публичных комнат (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка при получении списка публичных комнат');
    }
  },
}; 