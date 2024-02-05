import { Request } from "express";
import { makeMockResponse } from "./__mocks__/mockResponse.mock";
import { LoginController } from "../src/controllers/LoginController";

const mockUserService = {
    getToken: jest.fn(),
};

jest.mock("../src/services/UserService", () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService;
        })
    };
});

describe('Login Controller tests:', () => {
    const mockResponse = makeMockResponse();
    const loginController = new LoginController();

    beforeEach(() => {
        mockUserService.getToken = jest.fn()
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should return status code 200 when able to log in', async () => {

        const mockRequest = {
            body: {
                email: 'user@email.com',
                password: 'passwordUser',
            }
        } as Request;

        mockUserService.getToken = jest.fn().mockImplementation(() => 'token');

        await loginController.login(mockRequest, mockResponse);

        expect(mockUserService.getToken).toHaveBeenCalledWith('user@email.com', 'passwordUser');
        expect(mockResponse.state.status).toBe(200);
        expect(mockResponse.state.json).toMatchObject({ token: 'token' });
    });
    it('should return status code 401 when unable to log in', async () => {

        const mockRequest = {
            body: {
                email: 'user@email.com',
                password: 'passwordUser',
            }
        } as Request;

        mockUserService.getToken = jest.fn().mockImplementation(() => { throw new Error('Email/Password invalid!') });

        await loginController.login(mockRequest, mockResponse);

        expect(mockUserService.getToken).toHaveBeenCalledWith('user@email.com', 'passwordUser');
        expect(mockResponse.state.status).toBe(401);
        expect(mockResponse.state.json).toBe('Error: Email/Password invalid!');
    });
});