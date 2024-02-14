import express, { Request, Response } from 'express';
import 'dotenv/config';
import { router } from './routes';

const server = express();
server.use(express.json());
server.use(router);

server.listen(5000, () => console.log('SERVER ON'));