import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JoinRoom } from '../../components/videocall/JoinRoom';
import { useAuth } from '../../context/auth';
import { videoCallApi } from '../../api/videocall';
import { Button } from '../../components/ui/button';

export function JoinRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [accessCode, setAccessCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  
  useEffect(() => {
    // Извлекаем код доступа из URL
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      setAccessCode(code);
      
      // Загружаем информацию о комнате
      videoCallApi.joinRoom(code)
        .then(room => {
          // Если публичная комната и пользователь не авторизован,
          // предлагаем ввести имя гостя
          if (!room.isPrivate || isAuthenticated) {
            navigate(`/videocalls/${room.id}`);
          } else {
            setError('Для входа в приватную комнату необходима авторизация');
          }
        })
        .catch(err => {
          console.error('Ошибка при присоединении к комнате:', err);
          setError('Не удалось присоединиться к комнате. Проверьте код доступа.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [location.search, navigate, isAuthenticated]);
  
  const handleGuestJoin = async () => {
    if (!guestName.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }
    
    // Сохраняем имя гостя в localStorage
    localStorage.setItem('guestName', guestName);
    
    try {
      const room = await videoCallApi.joinRoom(accessCode);
      navigate(`/videocalls/${room.id}`);
    } catch (err) {
      console.error('Ошибка при присоединении к комнате как гость:', err);
      setError('Не удалось присоединиться к комнате. Возможно, требуется авторизация.');
    }
  };
  
  const handleLogin = () => {
    // Сохраняем URL для возврата после авторизации
    const returnUrl = `/videocalls/join?code=${accessCode}`;
    localStorage.setItem('loginReturnUrl', returnUrl);
    navigate('/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          {accessCode ? 'Присоединение к комнате' : 'Введите код комнаты'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {!accessCode && (
          <JoinRoom initialCode="" />
        )}
        
        {accessCode && error && error.includes('приватную') && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Данная комната требует авторизации для входа.
            </p>
            
            <Button onClick={handleLogin} className="w-full">
              Войти в систему
            </Button>
            
            <div className="text-center">
              <a href="/videocalls" className="text-blue-600 hover:underline">
                Вернуться к списку комнат
              </a>
            </div>
          </div>
        )}
        
        {accessCode && !error && !isAuthenticated && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Вы можете войти как гость. Пожалуйста, представьтесь:
            </p>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="guest-name" className="block text-sm font-medium text-gray-700">
                  Ваше имя
                </label>
                <input
                  id="guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <Button 
                onClick={handleGuestJoin} 
                disabled={!guestName.trim()}
                className="w-full"
              >
                Присоединиться как гость
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Или</p>
                <Button 
                  variant="outline" 
                  onClick={handleLogin}
                  className="w-full"
                >
                  Войти в систему
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 