import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { videoCallApi } from '../../api/videocall';
import { useToast } from '../ui/toast';

interface JoinRoomProps {
  initialCode?: string;
}

export function JoinRoom({ initialCode = '' }: JoinRoomProps) {
  const [accessCode, setAccessCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите код комнаты",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Вызываем обновленный API метод с одним параметром - кодом доступа
      const room = await videoCallApi.joinRoom(accessCode);
      
      toast({
        title: "Успешно",
        description: `Вы присоединились к комнате "${room.name}"`,
        variant: "success"
      });
      
      navigate(`/videocalls/${room.id}`);
    } catch (error) {
      console.error('Ошибка при присоединении к комнате:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось присоединиться к комнате. Проверьте код доступа или авторизуйтесь.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Присоединиться к комнате</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
            Код доступа к комнате
          </label>
          <input
            type="text"
            id="accessCode"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Введите код доступа"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || !accessCode.trim()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Присоединение...
              </>
            ) : (
              "Присоединиться к комнате"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 