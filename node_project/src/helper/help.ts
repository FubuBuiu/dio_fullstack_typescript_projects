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

        const ddd = key.slice(0, 2);

        const isPhone: boolean = ddd in json.statesByDDD;
        if (isPhone) {
            return 'PHONE';
        }
    }

    const emailsValid = ['@hotmail.com', '@gmail.com', '@outlook.com', '@yahoo.com'];

    for (const email of emailsValid) {
        if (key.includes(email)) {
            return "EMAIL";
        }
    }

    return 'RANDOM';
};