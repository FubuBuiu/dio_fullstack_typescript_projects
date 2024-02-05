import { User } from "../src/entities/User";
import { UserService } from "../src/services/UserService";
import * as jwt from 'jsonwebtoken';

jest.mock('../src/database', () => {
    initialize: jest.fn();
});
jest.mock('jsonwebtoken');

const mockUserRepository = require('../src/repositories/UserRepository');

describe('UserService tests', () => {

    const userService = new UserService(mockUserRepository);

    const mockUser = {
        id_user: '12345',
        name: 'Brendon',
        email: 'brendon@dio.com',
        password: 'brendon123',
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create new user', async () => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve({
            id_user: '12345',
            name: 'Brendon',
            email: 'brendon@dio.com',
            password: 'brendon123',
        }));
        const response = await userService.createUser('Brendon', 'brendon@dio.com', 'brendon123');
        expect(mockUserRepository.createUser).toHaveBeenCalled();
        expect(response).toMatchObject<User>(mockUser)
    });
    it('should return user token', async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(mockUser));
        jest.spyOn(jwt, 'sign').mockImplementation(() => 'token');

        const token = await userService.getToken('brendon@dio.com', 'brendon123');

        expect(token).toBe('token');
    });
    it('should return an error when the email or password provided is invalid', async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(null));
        await expect(userService.getToken('invalid@dio.com', 'invalidPassword')).rejects.toThrow(new Error('Email/Password invalid!'));
    });
    it('should return all users', async () => {
        jest.spyOn(userService, 'getAllUsers').mockImplementation(() => Promise.resolve(Array<User>()));

        const userList = await userService.getAllUsers();

        expect(userList).toStrictEqual<User[]>(Array<User>());
    });
    it('should return true when delete a user', async () => {
        mockUserRepository.deleteUser = jest.fn().mockImplementation(() => Promise.resolve(true));

        const userId: string = 'userId';

        const isDeletedUser: boolean = await userService.deleteUser(userId);

        expect(isDeletedUser).toBe(true);
        expect(mockUserRepository.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
    });
    it('should return false when trying delete a user that does not exist', async () => {
        mockUserRepository.deleteUser = jest.fn().mockImplementation(() => Promise.resolve(false));

        const userId: string = 'userIdThatDoesNotExist';
        const isDeletedUser = await userService.deleteUser(userId);

        expect(isDeletedUser).toBe(false);
        expect(mockUserRepository.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
    });
    it('should return user when user exist', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser));

        const response = await userService.getUser('12345');

        expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.getUser).toHaveBeenCalledWith('12345');
        expect(response).toMatchObject<User>(mockUser);
    });
    it('should return null when user does not exist', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(null));

        const response = await userService.getUser('12345');

        expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.getUser).toHaveBeenCalledWith('12345');
        expect(response).toBeNull();
    });
});