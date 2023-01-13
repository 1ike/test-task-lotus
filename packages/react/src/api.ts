import io from 'socket.io-client';

import { CreateRoomRequest, RoomName } from '@lotus/shared';
import { SERVER_URL, SERVER_PORT, API_PREFIX } from './config';

const baseUrl = `${SERVER_URL}:${SERVER_PORT}`;

export const socket = io(baseUrl);

const apiUrl = `${SERVER_URL}:${SERVER_PORT}/${API_PREFIX}`;

export const fetchRoomNames = (): Promise<RoomName[]> =>
  fetch(`${apiUrl}/rooms`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

export const createRoom = (data: CreateRoomRequest) =>
  fetch(`${apiUrl}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.text();
  });

export const deleteRoom = (roomName: RoomName) =>
  fetch(`${apiUrl}/rooms/${roomName}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  });
