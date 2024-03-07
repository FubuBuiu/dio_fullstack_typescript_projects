import { cpfValidation } from "../math/mathOperations";
import { KeyTypes } from "../services/BankAccountService";
import json from '../brazilianDDDs.json'

interface IJsonFile {
    statesByDDD: { [key: string]: any; };
    dddsByState: { [key: string]: any; };
}

export const identifyPixKeyType = async (key: string): Promise<KeyTypes> => {

    if (key.match(/^(?!(\d)\1{10})\d{11}$/)) {

        const isCpf: boolean = cpfValidation(key);

        if (isCpf) {
            return 'CPF';
        }

        const isPhone: boolean = phoneValidation(key);

        if (isPhone) {
            return 'PHONE';
        }
    }

    const isEmailValid = emailValidation(key);

    if (isEmailValid) {
        return "EMAIL";
    }

    return 'RANDOM';
};

export const emailValidation = (email: string): boolean => {
    const emailsValid = ['@hotmail.com', '@gmail.com', '@outlook.com', '@yahoo.com'];

    for (const suffix of emailsValid) {
        if (email.includes(suffix)) {
            return true;
        }
    }

    return false;
};

export const phoneValidation = (phone: string): boolean => {
    if (phone.match(/^(?!(\d)\1{10})\d{11}$/)) {
        const ddd = phone.slice(0, 2);
        const thirdDigit = phone.slice(2, 3);

        if (thirdDigit !== '9') {
            return false;
        }

        const isValid: boolean = ddd in json.statesByDDD;

        return isValid;
    }
    return false;
};