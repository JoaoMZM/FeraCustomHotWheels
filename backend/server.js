import e from 'express';
import 'dotenv/config';
import routes from './src/routes/routes.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import validarToken from './src/middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();

app.use(cors({
    origin: ['https://localhost:5173', 'http://localhost:5173',],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/uploads', e.static(path.join(__dirname, 'uploads')));
app.use(e.json());
app.use(cookieParser());


app.use('/', routes);
const SERVER_PORT = process.env.SERVER_PORT;
const HTTP_PORT = process.env.HTTP_PORT;
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
}

https.createServer(sslOptions, app).listen(SERVER_PORT, () => {
    console.log(`Servidor rodando em: https://localhost:${SERVER_PORT}`);
})

http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${HTTP_PORT}`)
})