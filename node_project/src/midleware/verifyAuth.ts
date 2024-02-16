import { NextFunction, Request, Response } from "express";
import { Jwt, JwtPayload, VerifyOptions, verify } from "jsonwebtoken";
import { User } from "../entities/User";

export function verifyAuth(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (authToken) {
        const [, token] = authToken.split(' ');

        const tokenKey = process.env.JWT_SECRET_KEY;

        console.log(tokenKey)

        try {
            if (!tokenKey) throw new Error();

            const options: VerifyOptions = {
                algorithms: ["HS512"]
            }

            const decoded: any = verify(token, tokenKey, options);

            if (decoded.id !== request.params.id) throw new Error();

            return next();
        } catch (error) {
            return response.status(401).json({ message: 'Unauthorized' });
        }
    }
};