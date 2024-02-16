import { SignOptions, sign } from 'jsonwebtoken';
import { User } from '../entities/User';
import { UserRepository } from './../repositories/UserRepository';
import { firestore } from '../database';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository = new UserRepository(firestore)) {
        this.userRepository = userRepository;
    }

    createUser = async (name: string, email: string, password: string) => {
        const user = new User(name, email, password);
        await this.userRepository.createUser(user);
    }

    getAllUsers = async (): Promise<User[]> => {
        return await this.userRepository.getAllUsers();
    };

    getUser = async (userId: string): Promise<User | null> => {
        return await this.userRepository.getUser(userId);
    };

    getAuthenticatedUser = async (email: string, password: string): Promise<User | null> => {
        return await this.userRepository.getUserByEmailAndPassword(email, password);
    };

    getToken = async (email: string, password: string): Promise<string> => {
        const secretKey = process.env.JWT_SECRET_KEY;

        if (secretKey === undefined) throw new Error('Secret key is undefined!');

        const user = await this.getAuthenticatedUser(email, password);

        if (user === null) {
            throw new Error('Email/Password invalid!');
        };

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const options: SignOptions = {
            algorithm: 'HS512',
        };

        const token = sign(payload, secretKey, options);

        return token;
    };

    deleteUser = async (userId: string): Promise<boolean> => {
        return await this.userRepository.deleteUser(userId);
    };
}