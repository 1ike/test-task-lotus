import io from 'socket.io-client';

import { SERVER_URL, SERVER_PORT } from './config';

export const socket = io(`${SERVER_URL}:${SERVER_PORT}`);
