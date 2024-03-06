import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../entities/User";
import { CustomError } from "../errors/CustomError";

export class UserController {

    userService: UserService;

    constructor(userService: UserService = new UserService()) {
        this.userService = userService;
    }

    createUser = async (request: Request, response: Response) => {
        const user: Omit<User, 'id' | 'phone' | 'adress'> = request.body;

        if (user.name === undefined || user.name === '') {
            return response.status(400).json({ message: 'Bad Request! Username required.' });
        };
        if (user.email === undefined || user.email === '') {
            return response.status(400).json({ message: 'Bad Request! Email required.' });
        };
        if (user.cpf === undefined) {
            return response.status(400).json({ message: 'Bad Request! CPF required.' });
        };
        if (user.password === undefined || user.password === '') {
            return response.status(400).json({ message: 'Bad Request! Password required.' });
        };

        try {
            await this.userService.createUser(user.name, user.cpf, user.email, user.password);
            return response.status(201).json({ message: 'User created.' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };

            return response.status(500).json(error.toString());
        }
    };

    getAllUsers = async (_request: Request, response: Response) => {

        try {
            const users = await this.userService.getAllUsers();
            return response.status(200).json(users);
        } catch (error: any) {
            return response.status(500).json(error.toString());
        }


    };

    getUser = async (request: Request, response: Response) => {
        const id = request.params.id;

        if (id === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })
        }

        try {
            const user = await this.userService.getUser(id);
            return response.status(200).json(user);
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };

            return response.status(500).json(error.toString());
        }
    };

    deleteUser = async (request: Request, response: Response) => {
        const userId: string = request.params.id;

        if (userId === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' })

        }

        try {
            await this.userService.deleteUser(userId);
            return response.status(200).json({ message: 'User deleted.' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };

            return response.status(500).json(error.toString());
        }
    }

    updateUser = async (request: Request, response: Response) => {
        const userId = request.params.id;
        const newUserData: Omit<User, 'id'> = request.body;

        if (userId === undefined) {
            return response.status(422).json({ message: 'Unprocessable Content!' });

        };

        if (Object.keys(newUserData).length === 0) {
            return response.status(400).json({ message: 'Bad Request! Request body was not provided' });
        };

        try {
            await this.userService.updateUser(userId, newUserData);
            return response.status(200).json({ message: 'User updated successfully!' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };

            return response.status(500).json(error.toString());
        }
    };
}