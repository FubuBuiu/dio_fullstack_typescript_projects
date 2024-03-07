import { User } from "../../src/entities/User";
import { UserService } from "../../src/services/UserService";
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { CustomError } from "../../src/errors/CustomError";
import * as bankAccountService from '../../src/services/BankAccountService';
import * as mathOperations from '../../src/math/mathOperations'

jest.mock('jsonwebtoken');

const mockUserRepository = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserByEmailAndPassword: jest.fn(),
    updateUser: jest.fn(),

};
const mockBankAccountService: Partial<bankAccountService.BankAccountService> = {
    createBankAccount: jest.fn(),
    deleteBankAccount: jest.fn(),
    getBankAccountByUserId: jest.fn()
};

jest.mock('@/repositories/UserRepository', () => {
    return {
        UserRepository: jest.fn().mockImplementation(() => {
            return mockUserRepository;
        }),
    }
});
jest.mock('@/services/BankAccountService', () => {
    return {
        BankAccountService: jest.fn(() => mockBankAccountService)
    }
});

describe('UserService tests', () => {

    const userService = new UserService();

    const mockUser = {
        id: '12345',
        name: 'User name',
        cpf: '11111111111',
        adress: {
            street: 'Street',
            neighborhood: 'Neighborhood',
            city: 'City',
            state: 'State',
            zipCode: 'Zip Code',
            complement: 'Complement'
        },
        phone: '99999999999',
        email: 'user@dio.com',
        password: 'user123',
    };

    describe('- Create User', () => {
        beforeEach(() => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn();
        });
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should create new user if not exist', async () => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn().mockImplementation(() => Promise.resolve(null));

            await userService.createUser('Brendon', '32069954005', 'brendon@dio.com', 'brendon123');

            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.createUser).toHaveBeenCalled();
            expect(mockBankAccountService.createBankAccount).toHaveBeenCalled();
        });
        it('should return error if user already exist', async () => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn().mockImplementation(() => Promise.resolve(mockUser));

            await expect(userService.createUser('Brendon', '32069954005', 'brendon@dio.com', 'brendon123')).rejects.toThrow(new CustomError('Conflict! User already exists.', 409));
            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
            expect(mockBankAccountService.createBankAccount).not.toHaveBeenCalled();
        });
        it('should return error when cpf provided is not valid', async () => {
            const cpfValidationSpy = jest.spyOn(mathOperations, 'cpfValidation');

            await expect(userService.createUser('Brendon', '11111111111', 'brendon@dio.com', 'brendon123')).rejects.toThrow(new CustomError('Bad Request! CPF invalid.', 400));
            expect(cpfValidationSpy).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getUserByEmailAndPassword).not.toHaveBeenCalled();
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
            expect(mockBankAccountService.createBankAccount).not.toHaveBeenCalled();
        });
    });
    describe('- Get token', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should return user token', async () => {
            jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(mockUser));
            jest.spyOn(jwt, 'sign').mockImplementation(() => 'token');

            const token = await userService.getToken('brendon@dio.com', 'brendon123');

            expect(token).toBe('token');
        });
        it('should return an error when the email or password provided is invalid', async () => {
            jest.spyOn(userService, 'getAuthenticatedUser').mockRejectedValue(new CustomError('Bad Request! Email/Password invalid.', 400));

            await expect(userService.getToken('invalid@dio.com', 'invalidPassword')).rejects.toThrow(new CustomError('Bad Request! Email/Password invalid.', 400));
        });

    });
    describe('- Get user', () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });
        it('should return user if does exist', async () => {
            mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser));

            const response = await userService.getUser('12345');

            expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getUser).toHaveBeenCalledWith('12345');
            expect(response).toMatchObject<User>(mockUser);
        });
        it('should return error if user does not exist', async () => {
            mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(null));

            await expect(userService.getUser('12345')).rejects.toThrow(new CustomError('Data Not Found! User does not exist.', 404));
            expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getUser).toHaveBeenCalledWith('12345');
        });
    });
    describe('- Get all users', () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });
        it('should return all users', async () => {
            mockUserRepository.getAllUsers = jest.fn().mockImplementation(() => Promise.resolve(Array<User>()));

            const userList = await userService.getAllUsers();

            expect(userList).toStrictEqual<User[]>(Array<User>());
        });
    });
    describe('- Delete user', () => {
        const mockBankAccount = {
            bankAccountId: 'bankAccountId',
            userId: 'userId',
            currentAccount: '123456784',
            agency: '12345',
            balance: 1000,
            pixKeys: {
                cpfKey: 'cpfKey',
                phoneKey: 'phoneKey',
                emailKey: 'emailKey',
                randomKey: 'randomKey',
            }
        };
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });
        it('should delete a user if exist', async () => {
            mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser));
            const userId: string = 'userId';
            mockBankAccountService.getBankAccountByUserId = jest.fn().mockResolvedValue(mockBankAccount);

            await userService.deleteUser(userId);

            expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
            expect(mockBankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountService.deleteBankAccount).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.deleteUser).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
        });
    });
    describe('- Updated user', () => {
        beforeEach(() => {
            mockUserRepository.updateUser = jest.fn();
        });
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should update user if does exist', async () => {
            jest.spyOn(userService, 'getUser').mockImplementation(() => Promise.resolve(mockUser));
            const userId = 'userId';
            const mockNewInformationUser = {
                name: 'Other user name',
                cpf: '83488252078',
                adress: {
                    street: 'Other Street',
                    neighborhood: 'Other Neighborhood',
                    city: 'Other City',
                    state: 'Other State',
                    zipCode: '48909730',
                    complement: 'Other Complement'
                },
                phone: '79988888888',
                email: 'otherEmail@dio.com',
                password: 'otherPassword',
            };

            await userService.updateUser(userId, mockNewInformationUser);

            expect(userService.getUser).toHaveBeenCalledTimes(1);
            expect(userService.getUser).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.updateUser).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, mockNewInformationUser);
        });
        it('should return error if user does not exist', async () => {
            jest.spyOn(userService, 'getUser').mockRejectedValue(new CustomError('Data Not Found! User does not exist.', 404));
            const userId = 'userId';
            const mockNewInformationUser = {
                name: 'Other user name',
                cpf: '83488252078',
                adress: {
                    street: 'Other Street',
                    neighborhood: 'Other Neighborhood',
                    city: 'Other City',
                    state: 'Other State',
                    zipCode: '48909730',
                    complement: 'Other Complement'
                },
                phone: '79988888888',
                email: 'otherEmail@dio.com',
                password: 'otherPassword',
            };

            await expect(userService.updateUser(userId, mockNewInformationUser)).rejects.toThrow(new CustomError('Data Not Found! User does not exist.', 404));
            expect(userService.getUser).toHaveBeenCalledTimes(1);
            expect(userService.getUser).toHaveBeenCalledWith(userId);
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });
        it('should return error when the CPF provided is not valid', async () => {
            const getUserSpy = jest.spyOn(userService, 'getUser');
            const mockNewInformationUser = {
                name: 'Other user name',
                cpf: '12345678901',
                adress: {
                    street: 'Other Street',
                    neighborhood: 'Other Neighborhood',
                    city: 'Other City',
                    state: 'Other State',
                    zipCode: '48909730',
                    complement: 'Other Complement'
                },
                phone: '79988888888',
                email: 'otherEmail@dio.com',
                password: 'otherPassword',
            };

            await expect(userService.updateUser('userId', mockNewInformationUser)).rejects.toThrow(new CustomError('Bad Request! CPF invalid.', 400));
            expect(getUserSpy).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });
        it('should return error when phone provided is not valid', async () => {
            const getUserSpy = jest.spyOn(userService, 'getUser');
            const mockNewInformationUser = {
                name: 'Other user name',
                cpf: '83488252078',
                adress: {
                    street: 'Other Street',
                    neighborhood: 'Other Neighborhood',
                    city: 'Other City',
                    state: 'Other State',
                    zipCode: '48909730',
                    complement: 'Other Complement'
                },
                phone: '12345678901',
                email: 'otherEmail@dio.com',
                password: 'otherPassword',
            };

            await expect(userService.updateUser('userId', mockNewInformationUser)).rejects.toThrow(new CustomError('Bad Request! Phone invalid.', 400));
            expect(getUserSpy).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });
        it('should return error when zip code provided is not valid', async () => {
            const getUserSpy = jest.spyOn(userService, 'getUser');
            const mockNewInformationUser = {
                name: 'Other user name',
                cpf: '83488252078',
                adress: {
                    street: 'Other Street',
                    neighborhood: 'Other Neighborhood',
                    city: 'Other City',
                    state: 'Other State',
                    zipCode: '123456',
                    complement: 'Other Complement'
                },
                phone: '12945678901',
                email: 'otherEmail@dio.com',
                password: 'otherPassword',
            };

            await expect(userService.updateUser('userId', mockNewInformationUser)).rejects.toThrow(new CustomError('Bad Request! CEP invalid.', 400));
            expect(getUserSpy).not.toHaveBeenCalled();
            expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
        });
    });
    describe('- Get authenticated user', () => {
        beforeEach(() => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn();
        });
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });
        it('should return user if he registered', async () => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn().mockResolvedValue(mockUser);
            const email = 'userEmail@hotmail.com';
            const password = 'userPassword';

            const user = await userService.getAuthenticatedUser(email, password);

            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledWith(email, password);
            expect(user).toMatchObject<User>(mockUser);
        });
        it('should return error if user is not registered', async () => {
            mockUserRepository.getUserByEmailAndPassword = jest.fn().mockImplementation(() => Promise.resolve(null));
            const email = 'userEmail@hotmail.com';
            const password = 'userPassword';

            await expect(userService.getAuthenticatedUser(email, password)).rejects.toThrow(new CustomError('Bad Request! Email/Password invalid.', 400));
            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getUserByEmailAndPassword).toHaveBeenCalledWith(email, password);
        });
    });
});