import { UserController } from './UserController';
import { IUser, UserService } from "../services/UserService";
import { makeMockRequest } from '../__mocks__/mockRequest.mock';
import { makeMockResponse } from '../__mocks__/mockResponse.mock';
import { Request } from 'express';

describe('UserController tests:', () => {
    const mockResponse = makeMockResponse();
    let mockUserService: Partial<UserService> = {};
    const userController = new UserController(mockUserService as UserService);

    describe('-Testing the createUser service', () => {

        beforeEach(() => {
            mockUserService.createUser = jest.fn();
        });
        it('should return status code 201 when adding a new user', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(201);
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado.' });
        });
        it('should return status code 400 when name in body is provided empty', () => {
            const mockRequest = {
                body: {
                    name: '',
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Username required.' });
        });
        it('should return status code 400 when name in body is provided undefined', () => {
            const mockRequest = {
                body: {
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Username required.' });
        });
        it('should return status code 400 when email in body is provided empty', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    email: '',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Email required.' });
        });
        it('should return status code 400 when email in body is provided undefined', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Email required.' });
        });
        it('should return status code 400 when password in body is provided empty', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    email: 'lucas@dio.com',
                    password: '',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Password required.' });
        });
        it('should return status code 400 when password in body is provided undefined', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    email: 'lucas@dio.com',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Password required.' });
        });
    });
    describe('-Testing the getAllUsers service', () => {

        beforeEach(() => mockUserService.getAllUsers = jest.fn());

        it('should return status code 200 when return all users from data base', () => {
            const mockRequest = {} as Request;

            userController.getAllUsers(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
        });
    });
    describe('-Testing the deleteUser service', () => {

        const userId: string = 'someUserId';

        beforeEach(() => {
            mockUserService.deleteUser = jest.fn();
        });

        it('should return status code 200 if the user was deleted', () => {

            mockUserService.deleteUser = jest.fn(() => true);

            const mockRequest = makeMockRequest({ params: { id: userId } });

            userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'User deleted.' });
        });
        it('should return status code 404 if the user not found', () => {

            mockUserService.deleteUser = jest.fn(() => false);

            const mockRequest = makeMockRequest({ params: { id: userId } });

            userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(404);
            expect(mockResponse.state.json).toMatchObject({ message: 'Data Not Found! User not found.' });
        });
        it('should return status code 422 if the user id not provided by URL', () => {

            const mockRequest = makeMockRequest({});

            userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(422);
            expect(mockResponse.state.json).toMatchObject({ message: 'Unprocessable Content!' });
        });
    });
    describe('-Testing the getUser service', () => {

        beforeEach(() => {
            mockUserService.getUser = jest.fn();
        });

        it('should return status code 200 if user exist', () => {
            const userId: string = 'userId';
            const user: IUser = {
                id: userId,
                name: "Username",
                email: "user@dio.com",
                password: 'usser123',
            };

            mockUserService.getUser = jest.fn(() => user);

            const mockRequest = makeMockRequest({ params: { id: userId } })

            userController.getUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toStrictEqual<IUser>(user);
        });
        it('should return status code 404 if user not exist', () => {
            const userId: string = 'userIdThatDoesNotExist';

            mockUserService.getUser = jest.fn(() => undefined);

            const mockRequest = makeMockRequest({ params: { id: userId } })

            userController.getUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(404);
            expect(mockResponse.state.json).toMatchObject({ message: 'Data Not Found! User not found.' });
        });
        it('should return status code 422 if user id no provided by URL', () => {
            const mockRequest = makeMockRequest({});

            userController.getUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(422);
            expect(mockResponse.state.json).toMatchObject({ message: 'Unprocessable Content!' });
        });
    });
});