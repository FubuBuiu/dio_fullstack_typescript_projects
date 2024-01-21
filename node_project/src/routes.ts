import { Router } from "express";
import { UserController } from './controllers/UserController';

export const router = Router();

const userController = new UserController()

router.get('/users', userController.getAllUsers);

router.get('/users/:id', userController.getUser);

router.delete('/users/:id', userController.deleteUser);

router.post('/users', userController.createUser);