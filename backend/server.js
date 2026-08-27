import e from 'express';
import 'dotenv/config';
import routes from './src/routes/routes.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();
app.use(e.json());
app.use(cookieParser());
app.use('/', routes);

const SERVER_PORT = process.env.SERVER_PORT;

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
}

https.createServer(sslOptions, app).listen(SERVER_PORT, () => {
    console.log(`Servidor rodando em: https://localhost:${SERVER_PORT}`);
})