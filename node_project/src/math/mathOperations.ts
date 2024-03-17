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

export const accountGenerate = () => {
    const accountDigitNumbers = randomInt(7, 12);
    let accountNumber: string = '';

    for (let index = 0; index < accountDigitNumbers; index++) {
        accountNumber = accountNumber + `${randomInt(0, 10)}`;
    }

    const accountDigit: string = accountDigitGenerate(accountNumber);

    return `${accountNumber}${accountDigit}`;
};

export const accountDigitGenerate = (curentAccountNumber: string): string => {
    const calcResult = (parseInt(curentAccountNumber[10] ?? 0) * 2) + (parseInt(curentAccountNumber[9] ?? 0) * 3) + (parseInt(curentAccountNumber[8] ?? 0) * 4) + (parseInt(curentAccountNumber[7] ?? 0) * 5) + (parseInt(curentAccountNumber[6] ?? 0) * 6) + (parseInt(curentAccountNumber[5] ?? 0) * 7) + (parseInt(curentAccountNumber[4] ?? 0) * 8) + (parseInt(curentAccountNumber[3] ?? 0) * 9) + (parseInt(curentAccountNumber[2] ?? 0) * 10) + (parseInt(curentAccountNumber[1] ?? 0) * 11) + (parseInt(curentAccountNumber[0] ?? 0) * 2);

    const mod11Result = calcResult % 11;

    let accountDigit = 11 - mod11Result;

    if (accountDigit > 9) {
        accountDigit = 0;
    }

    return `${accountDigit}`;
};

export const accountValidation = (account: string): boolean => {

    if (account.length < 8 || account.length > 12) {
        return false;
    };

    const number = account.slice(0, account.length - 1);
    const digit = account.slice(account.length - 1);

    const generatedDigit = accountDigitGenerate(number);

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

        const validatingDigit = cpfDigitGenerate(firstNineDigits);

        return verificatorDigits === validatingDigit
    }
    return false;
};

export const cpfDigitGenerate = (number: string): string => {
    // Calculating the first verify digit
    let firstVerifyDigit = '0';
    let resultCalcFirstVerifyingDigit = 0;

    for (let index = 0; index < number.length; index++) {
        resultCalcFirstVerifyingDigit = (parseInt(number[index]) * ((number.length + 1) - index)) + resultCalcFirstVerifyingDigit;
    }

    const mod11FirstDigit = resultCalcFirstVerifyingDigit % 11;
    if (mod11FirstDigit >= 2) {
        firstVerifyDigit = `${11 - mod11FirstDigit}`;
    }

    const newNumber = number + firstVerifyDigit;

    // Calculating the second verify digit
    let secondVerifyDigit = '0';
    let resultCalcSecondVerifyingDigit = 0;

    for (let index = 0; index < newNumber.length; index++) {
        resultCalcSecondVerifyingDigit = (parseInt(newNumber[index]) * ((newNumber.length + 1) - index)) + resultCalcSecondVerifyingDigit;
    }

    const mod11SecondDigit = resultCalcSecondVerifyingDigit % 11;
    if (mod11SecondDigit >= 2) {
        secondVerifyDigit = `${11 - mod11SecondDigit}`;
    }

    return firstVerifyDigit + secondVerifyDigit;
};