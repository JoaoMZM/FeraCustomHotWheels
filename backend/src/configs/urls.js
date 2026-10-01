// URLs usadas nos links de e-mail e nos redirecionamentos.
// O front (Vite) e o back rodam em HTTPS com o certificado do mkcert,
// então o padrão é https. Para mudar, defina no .env:
//   FRONTEND_URL=https://localhost:5173
//   BACKEND_URL=https://localhost:443
export const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://localhost:5173').replace(/\/+$/, '');
export const BACKEND_URL = (process.env.BACKEND_URL || `https://localhost:${process.env.SERVER_PORT || 443}`).replace(/\/+$/, '');
