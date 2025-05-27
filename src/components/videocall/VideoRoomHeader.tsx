import { VideoRoom } from '../../types/videocall';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';

interface VideoRoomHeaderProps {
  room: VideoRoom;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isFullScreenMode: boolean;
  onMuteToggle: () => void;
  onCameraToggle: () => void;
  onScreenShareToggle: () => void;
  onFullScreenToggle: () => void;
  onShare: () => void;
  onLeave: () => void;
}

export function VideoRoomHeader({
  room,
  isMuted,
  isCameraOff,
  isScreenSharing,
  isFullScreenMode,
  onMuteToggle,
  onCameraToggle,
  onScreenShareToggle,
  onFullScreenToggle,
  onShare,
  onLeave
}: VideoRoomHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center p-3 bg-gray-800 text-white">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold mr-2">
          {room.name}
        </h3>
        {room.isPrivate && (
          <span className="px-2 py-0.5 text-xs bg-yellow-600 rounded-full">
            Приватная
          </span>
        )}
        {!room.isPrivate && (
          <span className="px-2 py-0.5 text-xs bg-green-600 rounded-full">
            Публичная
          </span>
        )}
        {room.accessCode && (
          <span className="ml-3 text-sm text-gray-300">
            Код: <span className="font-mono">{room.accessCode}</span>
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Button
          size="sm"
          variant={isMuted ? "destructive" : "secondary"}
          className="w-10 h-10 p-0 rounded-full"
          onClick={onMuteToggle}
          title={isMuted ? "Включить микрофон" : "Выключить микрофон"}
        >
          {isMuted ? "🔊" : "🔇"}
        </Button>
        
        <Button
          size="sm"
          variant={isCameraOff ? "destructive" : "secondary"}
          className="w-10 h-10 p-0 rounded-full"
          onClick={onCameraToggle}
          title={isCameraOff ? "Включить камеру" : "Выключить камеру"}
        >
          {isCameraOff ? "📹" : "🚫"}
        </Button>
        
        <Button
          size="sm"
          variant={isScreenSharing ? "destructive" : "secondary"}
          className="w-10 h-10 p-0 rounded-full"
          onClick={onScreenShareToggle}
          title={isScreenSharing ? "Остановить демонстрацию" : "Демонстрация экрана"}
        >
          {isScreenSharing ? "❌" : "📊"}
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 rounded-full"
          onClick={onShare}
          title="Пригласить участников"
        >
          🔗
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="w-10 h-10 p-0 rounded-full"
          onClick={onFullScreenToggle}
          title={isFullScreenMode ? "Выйти из полноэкранного режима" : "На весь экран"}
        >
          {isFullScreenMode ? "↙️" : "↗️"}
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          className="w-10 h-10 p-0 rounded-full"
          onClick={onLeave}
          title="Выйти из комнаты"
        >
          ❌
        </Button>
      </div>
    </div>
  );
} 