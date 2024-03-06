import { UserController } from '../../src/controllers/UserController';
import { makeMockRequest } from '../__mocks__/mockRequest.mock';
import { makeMockResponse } from '../__mocks__/mockResponse.mock';
import { Request } from 'express';
import { User } from '../../src/entities/User';
import { CustomError } from '../../src/errors/CustomError';

const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn()
};

jest.mock("@/services/UserService", () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService;
        })
    };
});

describe('UserController tests:', () => {
    const mockResponse = makeMockResponse();
    const userController = new UserController();

    describe('-Testing the createUser service', () => {
        it('should return status code 201 when adding a new user', async () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    cpf: 11111111111,
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            await userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(201);
            expect(mockResponse.state.json).toMatchObject({ message: 'User created.' });
        });
        it('should return status code 400 when name in body is provided empty', () => {
            const mockRequest = {
                body: {
                    name: '',
                    cpf: 11111111111,
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
                    cpf: 11111111111,
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Username required.' });
        });
        it('should return status code 400 when cpf in body is provided undefined', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! CPF required.' });
        });
        it('should return status code 400 when email in body is provided undefined', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    cpf: 11111111111,
                    password: 'lucas123',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Email required.' });
        });
        it('should return status code 400 when email in body is provided empty', () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    cpf: 11111111111,
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
                    cpf: 11111111111,
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
                    cpf: 11111111111,
                    email: 'lucas@dio.com',
                    password: '',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Password required.' });
        });
        it('should return status code 400 when password in body is provided undefined', async () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    cpf: 11111111111,
                    email: 'lucas@dio.com',
                }
            } as Request;
            userController.createUser(mockRequest, mockResponse);
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Password required.' });
        });
        it('should return status code 409 when user already exist', async () => {
            const mockRequest = {
                body: {
                    name: 'Lucas',
                    cpf: 11111111111,
                    email: 'lucas@dio.com',
                    password: 'lucas123',
                }
            } as Request;
            mockUserService.createUser = jest.fn().mockRejectedValue(new CustomError('Conflict! User already exists.', 409));

            await userController.createUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(409);
            expect(mockResponse.state.json).toMatchObject({ message: 'Conflict! User already exists.' });
        });
    });
    describe('-Testing the getAllUsers service', () => {

        it('should return status code 200 when return all users from data base', async () => {
            mockUserService.getAllUsers = jest.fn().mockImplementation(() => Promise.resolve(Array<User>()));

            const mockRequest = {} as Request;

            await userController.getAllUsers(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject<User[]>(Array<User>());

            jest.clearAllMocks();
            jest.resetAllMocks();
        });
    });
    describe('-Testing the deleteUser service', () => {

        const userId: string = 'someUserId';

        beforeEach(() => {
            mockUserService.deleteUser = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });

        it('should return status code 200 if the user was deleted', async () => {

            mockUserService.deleteUser = jest.fn(() => true);

            const mockRequest = makeMockRequest({ params: { id: userId } });

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'User deleted.' });
        });
        it('should return status code 404 if the user not found', async () => {

            mockUserService.deleteUser = jest.fn().mockRejectedValue(new CustomError('Data Not Found! User does not exist.', 404));
            const mockRequest = makeMockRequest({ params: { id: userId } });

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(404);
            expect(mockResponse.state.json).toMatchObject({ message: 'Data Not Found! User does not exist.' });
        });
        it('should return status code 422 if the user is not provided by URL', () => {

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

        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });

        it('should return status code 200 when user exist', async () => {
            const userId: string = 'userId';
            const user = {
                id: userId,
                name: "Username",
                cpf: 11111111111,
                email: "user@dio.com",
                password: 'usser123',
            };

            mockUserService.getUser = jest.fn().mockImplementation(() => user);

            const mockRequest = makeMockRequest({ params: { id: userId } })

            await userController.getUser(mockRequest, mockResponse);

            expect(mockUserService.getUser).toHaveBeenCalledWith(userId);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toStrictEqual(user);
        });
        it('should return status code 404 when user not exist', async () => {
            const userId: string = 'userIdThatDoesNotExist';
            mockUserService.getUser = jest.fn().mockRejectedValue(new CustomError('Data Not Found! User does not exist.', 404));
            const mockRequest = makeMockRequest({ params: { id: userId } })

            await userController.getUser(mockRequest, mockResponse);

            expect(mockUserService.getUser).toHaveBeenCalledWith(userId);
            expect(mockResponse.state.status).toBe(404);
            expect(mockResponse.state.json).toMatchObject({ message: 'Data Not Found! User does not exist.' });
        });
        it('should return status code 422 when user id no provided by URL', async () => {
            const mockRequest = makeMockRequest({});

            await userController.getUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(422);
            expect(mockResponse.state.json).toMatchObject({ message: 'Unprocessable Content!' });
        });
    });
    describe('-Testing the updateUser service', () => {

        beforeEach(() => {
            mockUserService.updateUser = jest.fn()
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });

        it('should return status code 200 when the user is successfully updated', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    id: 'userId'
                },
                body: {
                    name: 'Other user name',
                    cpf: 22222222222,
                    adress: {
                        street: 'Other Street',
                        neighborhood: 'Other Neighborhood',
                        city: 'Other City',
                        state: 'Other State',
                        zipCode: 'Other Zip Code',
                        complement: 'Other Complement'
                    },
                    phone: 88888888888,
                    email: 'otherEmail@dio.com',
                    password: 'otherPassword',

                }
            });

            mockUserService.updateUser = jest.fn().mockImplementation(() => Promise.resolve(true));

            await userController.updateUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'User updated successfully!' });
        });
        it('should return status code 422 if the user is not provided by URL', async () => {

            const mockRequest = makeMockRequest({
                params: {},
                body: {
                    name: 'Other user name',
                    cpf: 22222222222,
                    adress: {
                        street: 'Other Street',
                        neighborhood: 'Other Neighborhood',
                        city: 'Other City',
                        state: 'Other State',
                        zipCode: 'Other Zip Code',
                        complement: 'Other Complement'
                    },
                    phone: 88888888888,
                    email: 'otherEmail@dio.com',
                    password: 'otherPassword',

                }
            });

            await userController.updateUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(422);
            expect(mockResponse.state.json).toMatchObject({ message: 'Unprocessable Content!' });
        });
        it('should return status code 400 if the body is not provided', async () => {

            const mockRequest = makeMockRequest({
                params: {
                    id: 'userId'
                },
            });

            await userController.updateUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body was not provided' });
        });
        it('should return status code 404 if user does not exist', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    id: 'userId'
                },
                body: {
                    name: 'Other user name',
                    cpf: 22222222222,
                    adress: {
                        street: 'Other Street',
                        neighborhood: 'Other Neighborhood',
                        city: 'Other City',
                        state: 'Other State',
                        zipCode: 'Other Zip Code',
                        complement: 'Other Complement'
                    },
                    phone: 88888888888,
                    email: 'otherEmail@dio.com',
                    password: 'otherPassword',

                }
            });
            mockUserService.updateUser = jest.fn().mockRejectedValue(new CustomError('Data Not Found! User does not exist.', 404));

            await userController.updateUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(404);
            expect(mockResponse.state.json).toMatchObject({ message: 'Data Not Found! User does not exist.' });
        });
    });
});