import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoCallApi } from '../../api/videocall';
import { VideoRoom } from '../../types/videocall';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';

export function VideoCallsPage() {
  const [rooms, setRooms] = useState<VideoRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true); // По умолчанию комната приватная
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const roomsData = await videoCallApi.getUserRooms();
      setRooms(roomsData);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке комнат:', err);
      setError('Не удалось загрузить список комнат');
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      setError('Введите название комнаты');
      return;
    }

    try {
      setIsLoading(true);
      const room = await videoCallApi.createRoom(
        newRoomName,
        isPrivate
      );
      setRooms([...rooms, room]);
      setNewRoomName('');
      setError(null);
    } catch (err) {
      console.error('Ошибка при создании комнаты:', err);
      setError('Не удалось создать комнату');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = (roomId: string) => {
    navigate(`/videocalls/${roomId}`);
  };

  // Переход на страницу присоединения по коду
  const goToJoinByCode = () => {
    navigate('/videocalls/join');
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Создать новую комнату</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="room-name">Название комнаты</Label>
              <input
                id="room-name"
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Введите название"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="room-private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="room-private">
                {isPrivate ? 'Приватная комната (только для авторизованных)' : 'Публичная комната (для всех)'}
              </Label>
            </div>

            <Button
              onClick={createRoom}
              disabled={isLoading || !newRoomName.trim()}
              className="w-full"
            >
              Создать комнату
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Присоединиться к комнате</h2>
          <p className="text-gray-600 mb-4">У вас есть код доступа к комнате? Присоединитесь к существующей видеоконференции.</p>
          <Button
            variant="outline"
            onClick={goToJoinByCode}
            className="w-full"
          >
            Ввести код доступа
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Мои комнаты</h2>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
            <p className="mt-2">Загрузка...</p>
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500 text-center py-4">У вас пока нет комнат</p>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{room.name}</h3>
                  <div className="text-sm text-gray-500">
                    <p>Создана: {new Date(room.createdAt).toLocaleDateString()}</p>
                    <p>Код доступа: {room.accessCode}</p>
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-200 mr-2">
                      {room.isPrivate ? 'Приватная' : 'Публичная'}
                    </span>
                  </div>
                </div>
                <Button onClick={() => joinRoom(room.id)}>
                  Присоединиться
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCallsPage;
