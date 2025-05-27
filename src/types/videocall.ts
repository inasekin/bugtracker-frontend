export interface VideoParticipant {
  id: string;
  userId: string;
  userName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  joinedAt: string;
}

export interface VideoRoom {
  id: string;
  name: string;
  isPrivate: boolean;
  maxParticipants: number;
  accessCode?: string;
  status: 'active' | 'closed';
  createdAt: string;
  closedAt?: string;
  participants: VideoParticipant[];
  ownerId: string;
}

export interface CreateRoomRequest {
  name: string;
  isPrivate?: boolean;
  maxParticipants?: number;
}

export interface JoinRoomRequest {
  roomId: string;
  accessCode?: string;
} 