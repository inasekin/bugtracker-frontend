import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { videoCallApi } from '../../api/videocall';
import { VideoRoom } from '../../types/videocall';
import { Button } from '../../components/ui/button';
import { SimpleVideoRoom } from '../../components/videocall/SimpleVideoRoom';
import { useToast } from '../../components/ui/toast';

export function VideoCallRoomPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const isFullScreen = searchParams.get('fullscreen') === 'true';
	const { toast } = useToast();

	const [room, setRoom] = useState<VideoRoom | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const loadRoom = async () => {
			try {
				setIsLoading(true);
				const roomData = await videoCallApi.getRoom(id);

				// Проверяем, что комната существует и не удалена
				if (!roomData) {
					throw new Error('Комната не найдена или была удалена');
				}

				console.log('Загружена комната:', roomData);
				setRoom(roomData);
				setError(null);

				// Показываем уведомление об успешной загрузке комнаты
				toast({
					title: 'Комната загружена',
					description: `Вы присоединились к комнате "${roomData.name}"`,
				});
			} catch (err: any) {
				console.error('Ошибка при загрузке комнаты:', err);

				// Устанавливаем понятное сообщение об ошибке
				if (err.message) {
					setError(err.message);
				} else {
					setError('Не удалось загрузить комнату');
				}

				// Показываем уведомление об ошибке
				toast({
					title: 'Ошибка при загрузке комнаты',
					description: err.message || 'Не удалось загрузить комнату',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadRoom();
	}, [id, toast]);

	const handleLeave = () => {
		navigate('/videocalls');
	};

	const handleClose = async () => {
		if (!room) return;

		try {
			await videoCallApi.closeRoom(room.id);

			toast({
				title: 'Комната закрыта',
				description: 'Комната успешно закрыта',
			});

			navigate('/videocalls');
		} catch (err: any) {
			console.error('Ошибка при закрытии комнаты:', err);

			setError(err.message || 'Не удалось закрыть комнату');

			toast({
				title: 'Ошибка',
				description: err.message || 'Не удалось закрыть комнату',
				variant: 'destructive',
			});
		}
	};

	const handleShareRoom = () => {
		if (!room) return;

		const roomUrl = `${window.location.origin}/videocalls/join?code=${room.accessCode}`;
		navigator.clipboard
			.writeText(roomUrl)
			.then(() => {
				toast({
					title: 'Ссылка скопирована',
					description: 'Ссылка на комнату скопирована в буфер обмена!',
				});
			})
			.catch((err) => {
				console.error('Не удалось скопировать ссылку:', err);

				toast({
					title: 'Не удалось скопировать',
					description: `Ссылка на комнату: ${roomUrl}`,
					duration: 10000,
				});
			});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
					<p>Загрузка комнаты...</p>
				</div>
			</div>
		);
	}

	if (error || !room) {
		return (
			<div className="container mx-auto p-4">
				<div className="bg-red-100 text-red-700 p-4 rounded mb-4">
					{error || 'Комната не найдена'}
				</div>
				<Button onClick={() => navigate('/videocalls')}>Вернуться к списку</Button>
			</div>
		);
	}

	// Если полноэкранный режим, отображаем только компонент SimpleVideoRoom
	if (isFullScreen) {
		return <SimpleVideoRoom room={room} isFullScreen onShare={handleShareRoom} />;
	}

	return (
		<div className="container mx-auto p-4 h-screen flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">{room.name}</h1>
					<p className="text-sm text-gray-500">
						Код доступа: {room.accessCode}
						<span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-200">
							{room.isPrivate ? 'Приватная' : 'Публичная'}
						</span>
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleShareRoom}>
						Пригласить
					</Button>
					<Button variant="outline" onClick={handleLeave}>
						Выйти
					</Button>
					<Button variant="destructive" onClick={handleClose}>
						Закрыть комнату
					</Button>
				</div>
			</div>

			<div className="flex-1">
				<SimpleVideoRoom room={room} onShare={handleShareRoom} />
			</div>
		</div>
	);
}

export default VideoCallRoomPage;
