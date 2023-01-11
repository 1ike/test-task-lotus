export const SERVER_URL = process.env.NX_SERVER_URL?.trim() || 'http://localhost';
export const SERVER_PORT = parseInt(process.env.NX_SERVER_PORT || '', 10) || 3333;

export const DEFAULT_ROOM_NAME = process.env.NX_ROOM_NAME || 123;

export const TITLE_POSTFIX = ' — Тестовое задание для Lotus';
