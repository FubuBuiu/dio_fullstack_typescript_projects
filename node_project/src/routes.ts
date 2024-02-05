import { Router } from "express";
import { UserController } from './controllers/UserController';
import { LoginController } from "./controllers/LoginController";
import { verifyAuth } from "./midleware/verifyAuth";

export const router = Router();

const userController = new UserController();

const loginController = new LoginController();

router.get('/users', userController.getAllUsers);

router.get('/users/:id?', verifyAuth, userController.getUser);

router.delete('/users/:id?', userController.deleteUser);

router.post('/users', userController.createUser);

router.post('/login', loginController.login);