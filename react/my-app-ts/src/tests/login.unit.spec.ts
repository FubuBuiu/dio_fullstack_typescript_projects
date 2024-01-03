import * as loginService from "../services/login";

describe('login', () => {
    let loginSpy: jest.SpyInstance;
    const userName: string = 'Brendon';
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    beforeEach(() => {
        loginSpy = jest.spyOn(loginService, 'login');
    })
    afterEach(() => {
        loginSpy.mockRestore()
    })

    it('Deve exibir um alert com boas vindas', () => {
        loginService.login();
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith()
        expect(mockAlert).toHaveBeenCalledWith('Bem vindo(a)')
    })
    it('Deve exibir um alert com de boas vindas com o nome do usuário', () => {
        loginService.login(userName);
        expect(loginSpy).toBeCalled();
        expect(loginSpy).toHaveBeenCalledWith(userName);
        expect(mockAlert).toHaveBeenCalledWith(`Bem vindo(a) ${userName}`)
    })
})