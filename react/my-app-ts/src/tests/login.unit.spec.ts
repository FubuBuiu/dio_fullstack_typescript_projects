import * as loginService from "../services/login";

const mockSetIsLoggedIn = jest.fn();

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    setIsLoggedIn: mockSetIsLoggedIn
}));

describe('Login function tests', () => {
    let loginSpy: jest.SpyInstance;
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    beforeEach(() => {
        loginSpy = jest.spyOn(loginService, 'login');
    })
    afterEach(() => {
        jest.restoreAllMocks();
    })

    it('should return user id if user exist', async () => {
        const email: string = 'user@dio.com';
        const password: string = 'user123';
        const response: string | undefined = await loginService.login(email, password);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(email, password);
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
    });
    it('should return undefined when provided email or password empty', async () => {
        const email: string = '';
        const password: string = '';
        const response = await loginService.login(email, password);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(email, password);
        expect(response).not.toBeDefined();
    });
    it("should return a alert with the message 'Informe o email!' when provided email empty", async () => {
        const email: string = '';
        const password: string = 'user123';
        await loginService.login(email, password);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(email, password);
        expect(mockAlert).toHaveBeenCalledWith('Informe o email!');
    });
    it("should return a alert with the message 'Informe a senha!' when provided password empty", async () => {
        const email: string = 'user@dio.com';
        const password: string = '';
        await loginService.login(email, password);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(email, password);
        expect(mockAlert).toHaveBeenCalledWith('Informe a senha!');
    });
    it("should return a alert with the message 'EMAIL OU SENHA ERRADO' when provided email or password wrong", async () => {
        const email: string = 'wrong@dio.com';
        const password: string = 'user321';
        await loginService.login(email, password);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(email, password);
        expect(mockAlert).toHaveBeenCalledWith('Email ou senha errado.');
    });
});