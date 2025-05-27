import axios from 'axios';
import { VideoRoom } from '../types/videocall';

// Базовый URL для API из env-переменных
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010';

export const VideoCallApi = {
    createRoom: async (isPrivate: boolean): Promise<VideoRoom> => {
        try {
            const response = await axios.post<VideoRoom>(`${API_BASE_URL}/videoroom`, { isPrivate });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании комнаты:', error);
            throw new Error('Не удалось создать комнату. Пожалуйста, попробуйте позже.');
        }
    },
    
    joinRoom: async (roomId: string, accessCode?: string): Promise<VideoRoom> => {
        try {
            const response = await axios.post<VideoRoom>(
                `${API_BASE_URL}/videoroom/${roomId}/join`, 
                { accessCode: accessCode || '' }
            );
            return response.data;
        } catch (error: any) {
            console.error('Ошибка при присоединении к комнате:', error);
            if (error.response?.status === 400) {
                throw new Error('Неверный код доступа или ID комнаты');
            } else if (error.response?.status === 404) {
                throw new Error('Комната не найдена');
            }
            throw new Error('Не удалось присоединиться к комнате. Пожалуйста, попробуйте позже.');
        }
    },

    getPublicRooms: async (): Promise<VideoRoom[]> => {
        try {
            const response = await axios.get<VideoRoom[]>(`${API_BASE_URL}/videoroom/public`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка публичных комнат:', error);
            throw new Error('Не удалось получить список публичных комнат. Пожалуйста, попробуйте позже.');
        }
    },
    
    // ... existing code ...
}; 