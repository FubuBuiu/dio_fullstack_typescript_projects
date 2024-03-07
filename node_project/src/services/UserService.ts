import { SignOptions, sign } from 'jsonwebtoken';
import { User } from '../entities/User';
import { UserRepository } from "../repositories/UserRepository";
import { firestore } from '../database';
import { CustomError } from '../errors/CustomError';
import { BankAccountService } from './BankAccountService';
import { cpfValidation } from '../math/mathOperations';
import { phoneValidation } from '../helper/help';

export class UserService {
    private userRepository: UserRepository;
    private bankAccountService: BankAccountService;

    constructor(userRepository = new UserRepository(firestore)) {
        this.userRepository = userRepository;
        this.bankAccountService = new BankAccountService();
    }

    createUser = async (name: string, cpf: string, email: string, password: string) => {
        const isCpfValid = cpfValidation(cpf);

        if (!isCpfValid) {
            throw new CustomError('Bad Request! CPF invalid.', 400);
        }

        let user = await this.userRepository.getUserByEmailAndPassword(email, password);

        if (user !== null) {
            throw new CustomError('Conflict! User already exists.', 409)
        }

        user = new User(name, cpf, email, password);
        await this.userRepository.createUser(user);
        await this.bankAccountService.createBankAccount(user.id);
    }

    getAllUsers = async (): Promise<User[]> => {
        return await this.userRepository.getAllUsers();
    };

    getUser = async (userId: string): Promise<User> => {
        const user = await this.userRepository.getUser(userId);

        if (user === null) {
            throw new CustomError('Data Not Found! User does not exist.', 404);
        }

        return user;
    };

    getAuthenticatedUser = async (email: string, password: string): Promise<User> => {
        const user = await this.userRepository.getUserByEmailAndPassword(email, password);

        if (user === null) {
            throw new CustomError('Bad Request! Email/Password invalid.', 400);
        }

        return user;
    };

    getToken = async (email: string, password: string): Promise<string> => {
        const secretKey = process.env.JWT_SECRET_KEY;

        if (secretKey === undefined) throw new Error('Secret key is undefined!');

        const user = await this.getAuthenticatedUser(email, password);

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

    deleteUser = async (userId: string) => {
        await this.getUser(userId);
        const { bankAccountId } = await this.bankAccountService.getBankAccountByUserId(userId);
        await this.userRepository.deleteUser(userId);
        await this.bankAccountService.deleteBankAccount(bankAccountId);
    };

    updateUser = async (userId: string, newUserData: Partial<Omit<User, 'id'>>) => {
        if (newUserData.cpf !== undefined && !cpfValidation(newUserData.cpf)) {
            throw new CustomError('Bad Request! CPF invalid.', 400);
        };

        if (newUserData.phone !== undefined && !phoneValidation(newUserData.phone.toString())) {
            throw new CustomError('Bad Request! Phone invalid.', 400);
        }

        if (newUserData.adress?.zipCode !== undefined && !newUserData.adress.zipCode.match(/^\d{8}$/)) {
            throw new CustomError('Bad Request! CEP invalid.', 400)
        }

        await this.getUser(userId);
        await this.userRepository.updateUser(userId, newUserData);
    };
}