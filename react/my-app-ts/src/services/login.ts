import { loginValidateApi } from "../api"

export const login = async (email: string, password: string): Promise<string | undefined> => {
    let alertMessage: string;
    if (email !== '' && password !== '') {
        const response = await loginValidateApi({ email, password });
        if (response !== undefined) {
            return response;
        }
        alertMessage = "Email ou senha errado.";
    } else {
        if (email === '') {
            alertMessage = 'Informe o email!';
        } else {
            alertMessage = 'Informe a senha!';
        }
    }
    alert(alertMessage);
    return undefined;
}