import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { router } from './routes';
// import { AppDataSource } from './database';

const server = express();

server.use(express.json());
server.use(router);

server.get('/', (_request: Request, response: Response) => {
    return response.status(200).json({ message: 'DioBank API' })
});

server.listen(5000, () => console.log('SERVER ON'));