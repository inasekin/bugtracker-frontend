import { BaseApi } from './base';
import { VideoRoom } from '../types/videocall';

export class VideoCallApi extends BaseApi {
  private static instance: VideoCallApi;

  private constructor() {
    super('/api/videocall');
  }

  public static getInstance(): VideoCallApi {
    if (!VideoCallApi.instance) {
      VideoCallApi.instance = new VideoCallApi();
    }
    return VideoCallApi.instance;
  }

  async createRoom(name: string, isPrivate: boolean = false, maxParticipants: number = 10): Promise<VideoRoom> {
    try {
      return await this.post<VideoRoom>('/rooms', { name, isPrivate, maxParticipants });
    } catch (error: any) {
      console.error('Ошибка при создании комнаты:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Требуется авторизация для создания комнаты');
        } else if (status === 403) {
          throw new Error('У вас нет прав на создание комнаты');
        } else if (status === 400) {
          throw new Error('Неверные данные для создания комнаты');
        }
      }
      throw new Error('Не удалось создать комнату: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async joinRoom(roomIdOrCode: string, accessCode?: string): Promise<VideoRoom> {
    try {
      if (!accessCode) {
        return await this.post<VideoRoom>('/rooms/join-by-code', { code: roomIdOrCode });
      }
      
      return await this.post<VideoRoom>(`/rooms/${roomIdOrCode}/join`, { accessCode });
    } catch (error: any) {
      console.error('Ошибка при присоединении к комнате:', error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error('Комната не найдена');
        } else if (status === 401) {
          throw new Error('Требуется авторизация для присоединения к комнате');
        } else if (status === 403) {
          throw new Error('У вас нет прав на присоединение к этой комнате или неверный код доступа');
        } else if (status === 409) {
          throw new Error('Вы уже присоединились к этой комнате');
        }
      }
      throw new Error('Не удалось присоединиться к комнате: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async getRoom(roomId: string): Promise<VideoRoom> {
    try {
      return await this.get<VideoRoom>(`/rooms/${roomId}`);
    } catch (error: any) {
      console.error(`Ошибка при получении комнаты ${roomId}:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Комната не найдена');
      }
      throw new Error('Не удалось получить информацию о комнате: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async getUserRooms(): Promise<VideoRoom[]> {
    try {
      return await this.get<VideoRoom[]>('/rooms/user');
    } catch (error: any) {
      console.error('Ошибка при получении комнат пользователя:', error);
      if (error.response && error.response.status === 401) {
        throw new Error('Требуется авторизация для просмотра ваших комнат');
      }
      throw new Error('Не удалось получить список комнат: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async getPublicRooms(): Promise<VideoRoom[]> {
    try {
      return await this.get<VideoRoom[]>('/rooms/public');
    } catch (error: any) {
      console.error('Ошибка при получении публичных комнат:', error);
      throw new Error('Не удалось получить список публичных комнат: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async closeRoom(roomId: string): Promise<void> {
    try {
      return await this.post(`/rooms/${roomId}/close`);
    } catch (error: any) {
      console.error(`Ошибка при закрытии комнаты ${roomId}:`, error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error('Комната не найдена');
        } else if (status === 401) {
          throw new Error('Требуется авторизация для закрытия комнаты');
        } else if (status === 403) {
          throw new Error('У вас нет прав для закрытия этой комнаты');
        }
      }
      throw new Error('Не удалось закрыть комнату: ' + (error.message || 'Неизвестная ошибка'));
    }
  }

  async leaveRoom(roomId: string): Promise<void> {
    try {
      return await this.post(`/rooms/${roomId}/leave`);
    } catch (error: any) {
      console.error(`Ошибка при выходе из комнаты ${roomId}:`, error);
      if (error.response && error.response.status === 404) {
        throw new Error('Комната не найдена');
      }
      throw new Error('Не удалось выйти из комнаты: ' + (error.message || 'Неизвестная ошибка'));
    }
  }
}

export const videoCallApi = VideoCallApi.getInstance();
