'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestWebRTC() {
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string>('Ожидание...');
	const [apiResponse, setApiResponse] = useState<any>(null);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

	async function testApi() {
		try {
			setStatus('Подключение к API...');
			const response = await fetch(
				'https://bugtracker.nasekinid.ru/api/videocall/test-connection',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP ошибка! Статус: ${response.status}`);
			}

			const data = await response.json();
			setApiResponse(data);
			setStatus('API соединение установлено!');
		} catch (err: any) {
			setError(`Ошибка API: ${err.message}`);
			setStatus('Ошибка подключения к API');
		}
	}

	async function testCamera() {
		try {
			setStatus('Запрос доступа к камере...');
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream;
			}

			setCameraStream(stream);
			setStatus('Камера работает!');
		} catch (err: any) {
			setError(`Ошибка камеры: ${err.message}`);
			setStatus('Ошибка доступа к камере');
		}
	}

	function stopCamera() {
		if (cameraStream) {
			cameraStream.getTracks().forEach((track) => track.stop());
			setCameraStream(null);
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = null;
			}
			setStatus('Камера отключена');
		}
	}

	useEffect(() => {
		// Очистка при размонтировании компонента
		return () => {
			if (cameraStream) {
				cameraStream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [cameraStream]);

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">Тест WebRTC компонентов</h1>

			<Card>
				<CardHeader>
					<CardTitle>Статус тестирования</CardTitle>
					<CardDescription>Текущее состояние: {status}</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					<div className="flex flex-wrap gap-2">
						<Button onClick={testApi}>Проверить API</Button>
						<Button onClick={testCamera}>Проверить камеру</Button>
						{cameraStream && (
							<Button variant="destructive" onClick={stopCamera}>
								Остановить камеру
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{apiResponse && (
				<Card>
					<CardHeader>
						<CardTitle>Ответ API</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-slate-100 p-4 rounded overflow-auto max-h-[300px]">
							{JSON.stringify(apiResponse, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Тест камеры</CardTitle>
					<CardDescription>Локальное видео</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="relative aspect-video bg-black rounded-lg overflow-hidden">
						<video
							ref={localVideoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover"
						/>
						{!cameraStream && (
							<div className="absolute inset-0 flex items-center justify-center text-white">
								Нажмите "Проверить камеру" для начала
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
