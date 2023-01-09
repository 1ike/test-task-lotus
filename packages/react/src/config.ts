export const SERVER_URL = process.env.NX_SERVER_URL?.trim() || 'http://localhost';
export const SERVER_PORT = parseInt(process.env.NX_SERVER_PORT || '', 10) || 3333;
