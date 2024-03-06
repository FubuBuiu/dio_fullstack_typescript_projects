import { randomInt, createHash, } from 'crypto';

export const agencyGenerate = (): string => {
    const agencyNumb = `${randomInt(0, 10)}${randomInt(0, 10)}${randomInt(0, 10)}${randomInt(0, 10)}`;
    const agencyDigit = agencyDigitGenerate(agencyNumb);

    return `${agencyNumb}${agencyDigit}`;
};

export const agencyDigitGenerate = (agencyNumb: string): string => {
    const agencyNumbSplitted = agencyNumb.split('');
    const calcResult = parseInt(agencyNumbSplitted[3]) * 1 + parseInt(agencyNumbSplitted[2]) * 2 + parseInt(agencyNumbSplitted[1]) * 3 + parseInt(agencyNumbSplitted[0]) * 4;
    const mod11Result = calcResult % 11;
    let agencyDigit = 11 - mod11Result;

    if (agencyDigit > 9) {
        agencyDigit = 0;
    };

    return `${agencyDigit}`;
};

export const currentAccountGenerate = () => {
    const currentAccountDigitNumbers = randomInt(7, 12);
    let currentAccountNumber: string = '';

    for (let index = 0; index < currentAccountDigitNumbers; index++) {
        currentAccountNumber = currentAccountNumber + `${randomInt(0, 10)}`;
    }

    const currentAccountDigit: string = currentAccountDigitGenerate(currentAccountNumber);

    return `${currentAccountNumber}${currentAccountDigit}`;
};

export const currentAccountDigitGenerate = (curentAccountNumber: string): string => {
    const calcResult = (parseInt(curentAccountNumber[10] ?? 0) * 2) + (parseInt(curentAccountNumber[9] ?? 0) * 3) + (parseInt(curentAccountNumber[8] ?? 0) * 4) + (parseInt(curentAccountNumber[7] ?? 0) * 5) + (parseInt(curentAccountNumber[6] ?? 0) * 6) + (parseInt(curentAccountNumber[5] ?? 0) * 7) + (parseInt(curentAccountNumber[4] ?? 0) * 8) + (parseInt(curentAccountNumber[3] ?? 0) * 9) + (parseInt(curentAccountNumber[2] ?? 0) * 10) + (parseInt(curentAccountNumber[1] ?? 0) * 11) + (parseInt(curentAccountNumber[0] ?? 0) * 2);

    const mod11Result = calcResult % 11;

    let currentAccountDigit = 11 - mod11Result;

    if (currentAccountDigit > 9) {
        currentAccountDigit = 0;
    }

    return `${currentAccountDigit}`;
};

export const currentAccountValidation = (currentAccount: string): boolean => {

    if (currentAccount.length < 8 || currentAccount.length > 12) {
        return false;
    };

    const number = currentAccount.slice(0, currentAccount.length - 1);
    const digit = currentAccount.slice(currentAccount.length - 1);

    const generatedDigit = currentAccountDigitGenerate(number);

    return digit === generatedDigit;
};

export const agencyValidation = (agency: string): boolean => {

    if (agency.length !== 5) {
        return false;
    }

    const number = agency.slice(0, 4);
    const digit = agency.slice(4);

    const generatedDigit = agencyDigitGenerate(number);

    return digit === generatedDigit;
};

export const randomPixKeyGenerate = (codification: string): string => {
    const randomKey = createHash('sha256').update(codification).digest('hex');
    return randomKey;
};

export const cpfValidation = (cpf: string): boolean => {
    if (cpf.match(/^(?!(\d)\1{10})\d{11}$/)) {
        const firstNineDigits = cpf.slice(0, 9);
        const verificatorDigits = cpf.slice(9);

        const firstValidatingDigit = cpfDigitGenerate(firstNineDigits);

        const firstTenDigits = firstNineDigits + firstValidatingDigit;

        const secondValidatingDigit = cpfDigitGenerate(firstTenDigits);

        return verificatorDigits === firstValidatingDigit + secondValidatingDigit
    }
    return false;
};

export const cpfDigitGenerate = (number: string): string => {
    // TODO Gerar os dois digitos verificadores aqui dentro dessa função 

    let resultCalcFirstVerifyingDigit = 0;

    for (let index = 0; index < number.length; index++) {
        resultCalcFirstVerifyingDigit = (parseInt(number[index]) * ((number.length + 1) - index)) + resultCalcFirstVerifyingDigit;
    }

    const mod11 = resultCalcFirstVerifyingDigit % 11;
    if (mod11 >= 2) {
        return `${11 - mod11}`;
    }
    return '0';
};