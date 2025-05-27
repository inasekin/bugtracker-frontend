"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Конфигурация ICE серверов для WebRTC
const iceConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'webrtc@live.com',
      credential: 'muazkh'
    }
  ]
};

export default function PeerConnectionTest() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Ожидание...");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // SDP обмен для WebRTC
  const [localSDP, setLocalSDP] = useState<string>("");
  const [remoteSDP, setRemoteSDP] = useState<string>("");
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isCallInitiator, setIsCallInitiator] = useState<boolean>(false);

  // Функция для тестирования API
  async function testApi() {
    try {
      setStatus("Подключение к API...");
      const response = await fetch("https://bugtracker.nasekinid.ru/api/videocall/test-connection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ошибка! Статус: ${response.status}`);
      }
      
      const data = await response.json();
      setApiResponse(data);
      setStatus("API соединение установлено!");
    } catch (err: any) {
      setError(`Ошибка API: ${err.message}`);
      setStatus("Ошибка подключения к API");
    }
  }

  // Функция для инициализации камеры
  async function initCamera() {
    try {
      setStatus("Запрос доступа к камере...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
      setStatus("Камера работает!");
      return stream;
    } catch (err: any) {
      setError(`Ошибка камеры: ${err.message}`);
      setStatus("Ошибка доступа к камере");
      return null;
    }
  }

  // Остановка камеры
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setStatus("Камера отключена");
    }
  }

  // Инициализация WebRTC
  async function initWebRTC() {
    try {
      setStatus("Инициализация WebRTC...");
      
      // Убедимся, что камера инициализирована
      let stream = cameraStream;
      if (!stream) {
        stream = await initCamera();
        if (!stream) {
          throw new Error("Не удалось получить доступ к камере");
        }
      }
      
      // Создаем соединение
      const pc = new RTCPeerConnection(iceConfiguration);
      setPeerConnection(pc);
      
      // Добавляем все треки из локального потока в соединение
      stream.getTracks().forEach(track => {
        if (stream) {
          pc.addTrack(track, stream);
        }
      });
      
      // Обработчик для ICE-кандидатов
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Новый ICE кандидат:", event.candidate);
        } else {
          // Нет больше кандидатов, SDP готов
          console.log("ICE gathering complete");
          setLocalSDP(JSON.stringify(pc.localDescription));
        }
      };
      
      // Обработчик для удаленных потоков
      pc.ontrack = (event) => {
        console.log("Получен удаленный трек:", event.track.kind);
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Обработчик изменения состояния соединения
      pc.onconnectionstatechange = () => {
        console.log("Состояние соединения:", pc.connectionState);
        setStatus(`Состояние соединения: ${pc.connectionState}`);
      };
      
      // Обработчик изменения состояния ICE соединения
      pc.oniceconnectionstatechange = () => {
        console.log("Состояние ICE соединения:", pc.iceConnectionState);
      };
      
      setStatus("WebRTC инициализирован");
      return pc;
    } catch (err: any) {
      setError(`Ошибка инициализации WebRTC: ${err.message}`);
      setStatus("Ошибка инициализации WebRTC");
      return null;
    }
  }

  // Создание предложения (SDP Offer)
  async function createOffer() {
    try {
      setIsCallInitiator(true);
      let pc = peerConnection;
      if (!pc) {
        pc = await initWebRTC();
        if (!pc) {
          throw new Error("Не удалось инициализировать WebRTC");
        }
      }
      
      // Создаем offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      setStatus("Создано предложение SDP Offer");
      // SDP будет установлен в setLocalSDP через onicecandidate
    } catch (err: any) {
      setError(`Ошибка создания предложения: ${err.message}`);
      setStatus("Ошибка создания предложения");
    }
  }

  // Принятие предложения и создание ответа
  async function createAnswer() {
    try {
      setIsCallInitiator(false);
      let pc = peerConnection;
      if (!pc) {
        pc = await initWebRTC();
        if (!pc) {
          throw new Error("Не удалось инициализировать WebRTC");
        }
      }
      
      // Устанавливаем удаленное описание из введенного SDP
      if (!remoteSDP) {
        throw new Error("Введите удаленный SDP Offer");
      }
      
      const offer = JSON.parse(remoteSDP);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Создаем ответ
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      setStatus("Создан ответ SDP Answer");
      // SDP будет установлен в setLocalSDP через onicecandidate
    } catch (err: any) {
      setError(`Ошибка создания ответа: ${err.message}`);
      setStatus("Ошибка создания ответа");
    }
  }

  // Прием ответа
  async function receiveAnswer() {
    try {
      if (!peerConnection) {
        throw new Error("WebRTC не инициализирован");
      }
      
      if (!remoteSDP) {
        throw new Error("Введите удаленный SDP Answer");
      }
      
      // Устанавливаем удаленное описание из введенного SDP
      const answer = JSON.parse(remoteSDP);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      
      setStatus("SDP Answer принят");
    } catch (err: any) {
      setError(`Ошибка приема ответа: ${err.message}`);
      setStatus("Ошибка приема ответа");
    }
  }

  // Сброс соединения
  function resetConnection() {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setLocalSDP("");
    setRemoteSDP("");
    setIsCallInitiator(false);
    setStatus("Соединение сброшено");
  }

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [cameraStream, peerConnection]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Тест WebRTC Peer-to-Peer соединения</h1>
      
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
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={testApi}>Проверить API</Button>
            <Button onClick={initCamera}>Включить камеру</Button>
            {cameraStream && <Button variant="destructive" onClick={stopCamera}>Остановить камеру</Button>}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={createOffer} disabled={!cameraStream}>Создать предложение (Offer)</Button>
            <Button onClick={createAnswer} disabled={!cameraStream || !remoteSDP}>Создать ответ (Answer)</Button>
            <Button onClick={receiveAnswer} disabled={!peerConnection || !remoteSDP || !isCallInitiator}>Принять ответ</Button>
            <Button variant="destructive" onClick={resetConnection} disabled={!peerConnection}>Сбросить соединение</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Локальное видео</CardTitle>
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
                  Нажмите "Включить камеру" для начала
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Удаленное видео</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {peerConnection ? "Ожидание удаленного соединения..." : "Инициализируйте WebRTC"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>SDP обмен</CardTitle>
          <CardDescription>Скопируйте и отправьте SDP другому пиру</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="localSDP">Ваш локальный SDP ({isCallInitiator ? "Offer" : "Answer"}):</Label>
            <div className="flex items-center mt-1">
              <Input 
                id="localSDP" 
                value={localSDP} 
                readOnly 
                className="font-mono text-xs h-24"
              />
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.writeText(localSDP)}
                disabled={!localSDP}
                className="ml-2"
              >
                Копировать
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="remoteSDP">Введите удаленный SDP ({isCallInitiator ? "Answer" : "Offer"}):</Label>
            <div className="flex items-center mt-1">
              <Input 
                id="remoteSDP" 
                value={remoteSDP} 
                onChange={(e) => setRemoteSDP(e.target.value)}
                className="font-mono text-xs h-24"
              />
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.readText().then(text => setRemoteSDP(text))}
                className="ml-2"
              >
                Вставить
              </Button>
            </div>
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
    </div>
  );
} 