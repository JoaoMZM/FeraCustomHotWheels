import e from 'express';
import 'dotenv/config';
import routes from './routes/routes.js';

const app = e();
app.use(e.json());
app.use('/', routes);

const SERVER_PORT = process.env.SERVER_PORT;

app.listen(SERVER_PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${SERVER_PORT}`);
})