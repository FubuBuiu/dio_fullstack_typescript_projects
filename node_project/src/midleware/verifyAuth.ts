import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function verifyAuth(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (authToken) {
        const [, token] = authToken.split(' ');

        const tokenKey = '123456789';

        try {
            const { sub } = verify(token, tokenKey);

            if (sub !== request.params.id) throw new Error();

            return next();
        } catch (error) {
            return response.status(401).json({ message: 'Unauthorized' });
        }
    }
};