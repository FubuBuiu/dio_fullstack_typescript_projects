import { Request, Response, response } from "express";
import { IUser, UserService } from "../services/UserService";

export class UserController {

    userService: UserService;

    constructor(userService: UserService = new UserService()) {
        this.userService = userService;
    }

    createUser = (request: Request, response: Response) => {
        const user: Omit<IUser, 'id'> = request.body;

        if (user.name === undefined || user.name === '') {
            return response.status(400).json({ message: 'Bad Request! Username required.' });
        };
        if (user.email === undefined || user.email === '') {
            return response.status(400).json({ message: 'Bad Request! Email required.' });
        };
        if (user.password === undefined || user.password === '') {
            return response.status(400).json({ message: 'Bad Request! Password required.' });
        };

        this.userService.createUser(user)
        return response.status(201).json({ message: 'Usuário criado.' });
    };

    getAllUsers = (_request: Request, response: Response) => {

        const users = this.userService.getAllUsers();

        return response.status(200).json(users);
    };

    getUser = (request: Request, response: Response) => {
        const id: string = request.params.id;

        if (id === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })
        }

        const user = this.userService.getUser(id);

        if (user === undefined) {
            return response.status(404).json({ message: 'Data Not Found! User not found.' })
        }

        return response.status(200).json(user);
    };

    deleteUser = (request: Request, response: Response) => {
        const userId: string = request.params.id;

        if (userId === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })

        }

        const isUserDeleted: boolean = this.userService.deleteUser(userId);

        if (!isUserDeleted) {
            return response.status(404).json({ message: 'Data Not Found! User not found.' })
        }

        return response.status(200).json({ message: 'User deleted.' });
    }
}