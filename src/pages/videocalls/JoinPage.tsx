import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JoinRoom } from '../../components/videocall/JoinRoom';
import { useAuth } from '../../context/auth';
import { useToast } from '../../components/ui/toast';
import { videoCallApi } from '../../api/videocall';

export function JoinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Извлекаем код доступа из URL
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    
    if (code) {
      setAccessCode(code);
      
      // Если пользователь авторизован и есть код, сразу пытаемся присоединиться
      if (isAuthenticated) {
        setIsLoading(true);
        
        videoCallApi.joinRoom(code)
          .then(room => {
            toast({
              title: "Успешно",
              description: `Вы присоединились к комнате "${room.name}"`,
              variant: "success"
            });
            navigate(`/videocalls/${room.id}`);
          })
          .catch(error => {
            console.error('Ошибка при автоматическом присоединении к комнате:', error);
            // Не делаем redirect, вместо этого показываем форму ввода кода
            toast({
              title: "Требуется ввод кода",
              description: "Пожалуйста, подтвердите код доступа для присоединения к комнате",
              variant: "default"
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // Если пользователь не авторизован, но комната публичная, разрешаем подключение
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, location.search, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Подключение к комнате...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Присоединение к видеокомнате</h1>
        
        <JoinRoom initialCode={accessCode} />
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/videocalls')}
            className="text-blue-600 hover:underline"
          >
            Вернуться к списку комнат
          </button>
        </div>
      </div>
    </div>
  );
} 