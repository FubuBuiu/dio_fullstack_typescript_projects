import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {

    userService: UserService;

    constructor(userService: UserService = new UserService()) {
        this.userService = userService;
    }

    createUser = async (request: Request, response: Response) => {
        const user = request.body;

        if (user.name === undefined || user.name === '') {
            return response.status(400).json({ message: 'Bad Request! Username required.' });
        };
        if (user.email === undefined || user.email === '') {
            return response.status(400).json({ message: 'Bad Request! Email required.' });
        };
        if (user.password === undefined || user.password === '') {
            return response.status(400).json({ message: 'Bad Request! Password required.' });
        };

        await this.userService.createUser(user.name, user.email, user.password);

        return response.status(201).json({ message: 'Usuário criado.' });
    };

    getAllUsers = async (_request: Request, response: Response) => {

        const users = await this.userService.getAllUsers();

        return response.status(200).json(users);
    };

    getUser = async (request: Request, response: Response) => {
        const id = request.params.id;

        if (id === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })
        }

        const user = await this.userService.getUser(id);

        if (!user) {
            return response.status(404).json({ message: 'Data Not Found! User not found.' })
        }

        return response.status(200).json(user);
    };

    deleteUser = async (request: Request, response: Response) => {
        const userId: string = request.params.id;

        if (userId === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })

        }

        const isUserDeleted: boolean = await this.userService.deleteUser(userId);

        if (!isUserDeleted) {
            return response.status(404).json({ message: 'Data Not Found! User not found.' })
        }

        return response.status(200).json({ message: 'User deleted.' });
    }
}