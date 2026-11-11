export const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://localhost:5173').replace(/\/+$/, '');
export const BACKEND_URL = (process.env.BACKEND_URL || `https://localhost:${process.env.SERVER_PORT || 443}`).replace(/\/+$/, '');
