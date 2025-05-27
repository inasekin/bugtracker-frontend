import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/auth';
import { VideoRoom } from '../../types/videocall';
import { Button } from '../../components/ui/button';
import { videoCallApi } from '../../api/videocall';
import { useToast } from '../../components/ui/toast';
import { VideoRoomHeader } from './VideoRoomHeader';
import { CustomAvatar } from '../ui/avatar';
import { AlertCircle } from 'lucide-react';

interface SimpleVideoRoomProps {
  room: VideoRoom;
  isFullScreen?: boolean;
  onShare?: () => void;
  onLeave?: () => void;
}

export function SimpleVideoRoom({ room, isFullScreen = false, onShare, onLeave }: SimpleVideoRoomProps) {
  const [initError, setInitError] = useState<string | null>(null);
  
  // Проверяем базовые данные комнаты
  useEffect(() => {
    console.log('Проверка данных комнаты:', room);
    if (!room) {
      setInitError('Данные комнаты не предоставлены');
      console.error('Ошибка: данные комнаты не предоставлены');
      return;
    }
    
    if (!room.id) {
      setInitError('Идентификатор комнаты отсутствует');
      console.error('Ошибка: идентификатор комнаты отсутствует');
      return;
    }
    
    console.log(`Успешная инициализация комнаты: ${room.id}`);
  }, [room]);

  const { userId, username, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]); // Имена участников
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState<string>("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Загружаем список участников при монтировании
  useEffect(() => {
    setIsLoading(true);
    
    if (room && room.participants && room.participants.length > 0) {
      setParticipants(room.participants
        .filter(p => p.userName)
        .map(p => p.userName)
      );
    }
    
    // Эмулируем успешную загрузку через 1 секунду
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [room]);
  
  // Простая проверка доступности сервиса
  const checkServiceAvailability = useCallback(async () => {
    try {
      const apiUrl = `http://localhost:5010/health`;
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        toast({
          title: "Сервис доступен",
          description: "API видеозвонков работает нормально.",
        });
      } else {
        toast({
          title: "Сервис недоступен",
          description: `Код ошибки: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к API. Сервис может быть недоступен.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Инициализация камеры
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setCameraStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Ошибка доступа к медиа устройствам:', err);
      
      let errorMessage = 'Не удалось получить доступ к камере и микрофону.';
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Доступ к камере и микрофону заблокирован. Пожалуйста, разрешите доступ в настройках браузера и перезагрузите страницу.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Камера или микрофон не найдены. Проверьте подключение устройств.';
        }
      }
      
      toast({
        title: "Проблема с доступом к устройствам",
        description: errorMessage,
        variant: "destructive",
        duration: 7000
      });
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [toast]);
  
  // Инициализируем камеру при монтировании
  useEffect(() => {
    initCamera().catch(console.error);
  }, [initCamera]);
  
  // Простые функции управления медиа
  const toggleMute = () => {
    if (cameraStream) {
      cameraStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleCamera = () => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach(track => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };
  
  // Функция выхода из комнаты
  const leaveRoom = async () => {
    try {
      if (isAuthenticated && room.id) {
        await videoCallApi.leaveRoom(room.id);
      }
      
      if (cameraStream) {
        // Ensure camera is properly shut down
        cameraStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped`);
        });
        setCameraStream(null);
      }
      
      if (onLeave) {
        onLeave();
      } else {
        window.location.href = '/videocalls';
      }
    } catch (err) {
      console.error('Ошибка при выходе из комнаты:', err);
      toast({
        title: "Ошибка",
        description: "Не удалось корректно выйти из комнаты",
        variant: "destructive"
      });
      
      // Even if there's an error, make sure to stop all tracks
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      window.location.href = '/videocalls';
    }
  };
  
  // Ensure camera is shut down on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped on unmount`);
        });
      }
    };
  }, [cameraStream]);
  
  // Добавляем виртуальных участников для тестирования интерфейса
  const addTestParticipants = () => {
    const testParticipants = ['Анна', 'Иван', 'Мария', 'Александр'];
    setParticipants(prev => [...prev, ...testParticipants]);
    toast({
      title: "Добавлены тестовые участники",
      description: "Добавлены виртуальные участники для тестирования интерфейса"
    });
  };
  
  // Копирование ссылки на комнату
  const shareRoom = () => {
    const roomUrl = `${window.location.origin}/videocalls/join?code=${room.accessCode}`;
    navigator.clipboard.writeText(roomUrl)
      .then(() => {
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка на комнату скопирована в буфер обмена!"
        });
        if (onShare) onShare();
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        toast({
          title: "Ссылка для приглашения",
          description: roomUrl,
          duration: 10000
        });
      });
  };
  
  // Рендеринг компонента при ошибке инициализации
  if (initError) {
    return <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-xl font-bold mb-4">Ошибка инициализации комнаты</h2>
      <p>{initError}</p>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
        Попробовать снова
      </Button>
    </div>;
  }

  // Рендеринг при ошибке подключения
  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Ошибка подключения</h2>
          <p className="text-gray-700 mb-6">{connectionErrorMessage}</p>
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={checkServiceAvailability}
            >
              Проверить доступность сервиса
            </Button>
            <Button 
              variant="secondary"
              className="w-full" 
              onClick={() => window.location.href = '/videocalls'}
            >
              Вернуться к списку комнат
            </Button>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded text-left">
            <h3 className="font-medium mb-2">Возможные причины:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Сервис видеозвонков недоступен</li>
              <li>Проблемы с вашим интернет-соединением</li>
              <li>Истек срок действия учетных данных</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Рендеринг при загрузке
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-6 max-w-md bg-blue-900 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-4">Загрузка комнаты</h2>
          <p className="text-white">Подождите, идет установка соединения...</p>
        </div>
      </div>
    );
  }

  // Рендеринг при ошибке
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-6 max-w-md bg-red-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Ошибка</h2>
          <p className="text-white mb-4">{error}</p>
          <div className="bg-red-800 p-4 rounded-md mb-4">
            <h3 className="text-white font-semibold mb-2">Что можно попробовать:</h3>
            <ul className="text-white text-sm list-disc list-inside">
              <li>Проверьте подключение к интернету</li>
              <li>Разрешите доступ к камере и микрофону</li>
              <li>Закройте другие приложения, использующие камеру</li>
              <li>Используйте последнюю версию браузера</li>
              <li>Попробуйте подключиться через другое устройство</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.href = '/videocalls'}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors mr-2"
          >
            Вернуться к списку комнат
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col rounded-lg overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : ''}`} 
      style={{ height: isFullScreen ? '100vh' : '80vh' }}
    >
      <VideoRoomHeader 
        room={room}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isScreenSharing={false}
        isFullScreenMode={isFullScreen}
        onMuteToggle={toggleMute}
        onCameraToggle={toggleCamera}
        onScreenShareToggle={() => toast({ title: "Функция недоступна", description: "Демонстрация экрана временно отключена" })}
        onFullScreenToggle={() => toast({ title: "Функция недоступна", description: "Полноэкранный режим временно отключен" })}
        onShare={shareRoom}
        onLeave={leaveRoom}
      />
      
      <div className="flex-1 bg-gray-900 p-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {username || 'Вы'} (Вы)
              {isCameraOff && <span className="ml-2">🎥 Выкл</span>}
              {isMuted && <span className="ml-2">🔇 Выкл</span>}
            </div>
          </div>
          
          {participants.length > 0 ? (
            participants.map((name, index) => (
              <div key={index} className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center text-white">
                <div className="text-center">
                  <CustomAvatar 
                    name={name || 'Гость'} 
                    size="lg" 
                    className="mx-auto mb-4" 
                  />
                  <p>{name || 'Гость'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center text-white">
              <div className="text-center">
                <CustomAvatar 
                  name={username || "Организатор"} 
                  size="lg" 
                  className="mx-auto mb-4" 
                />
                <p>Ожидание участников...</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={addTestParticipants}
                >
                  Добавить тестовых участников
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 