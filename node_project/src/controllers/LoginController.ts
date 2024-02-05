import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class LoginController {

    userService: UserService;

    constructor(userService = new UserService()) {
        this.userService = userService;
    }

    login = async (request: Request, response: Response) => {

        const { email, password } = request.body;

        try {
            const token = await this.userService.getToken(email, password);

            return response.status(200).json({ token });
        } catch (error: any) {
            return response.status(401).json(error.toString());
        }
    };
}