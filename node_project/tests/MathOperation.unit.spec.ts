import { agencyDigitGenerate, agencyGenerate, currentAccountGenerate, agencyValidation, currentAccountDigitGenerate, currentAccountValidation, randomPixKeyGenerate, cpfValidation, cpfDigitGenerate } from './../src/math/mathOperations';
import * as mathOperations from '../src/math/mathOperations';

const mockCrypto = {
    randomInt: jest.fn(),
};

jest.mock('crypto', () => {
    return {
        randomInt: jest.fn(() => mockCrypto.randomInt()),
    }
});
describe('Math operations tests', () => {

    afterEach(() => jest.restoreAllMocks());

    describe('Current Account tests:', () => {
        it('should return current account number when currentAccountGenerate() has been called', () => {
            const currentAccoutnDigitGenerateSpy = jest.spyOn(mathOperations, 'currentAccountDigitGenerate');
            mockCrypto.randomInt = jest.fn().mockReturnValueOnce(9);
            mockCrypto.randomInt.mockReturnValueOnce(0);
            mockCrypto.randomInt.mockReturnValueOnce(6);
            mockCrypto.randomInt.mockReturnValueOnce(8);
            mockCrypto.randomInt.mockReturnValueOnce(3);
            mockCrypto.randomInt.mockReturnValueOnce(0);
            mockCrypto.randomInt.mockReturnValueOnce(2);
            mockCrypto.randomInt.mockReturnValueOnce(1);
            mockCrypto.randomInt.mockReturnValueOnce(1);
            mockCrypto.randomInt.mockReturnValueOnce(5);

            const currentAccount = currentAccountGenerate();

            expect(currentAccoutnDigitGenerateSpy).toHaveBeenCalledTimes(1);
            expect(currentAccoutnDigitGenerateSpy).toHaveBeenCalledWith('068302115');
            expect(currentAccount.length >= 7).toBeTruthy();
            expect(currentAccount.length <= 11).toBeTruthy();
            expect(typeof currentAccount).toBe('string');
        });
        it('should return current account verify digit', () => {
            const currentAccount = '265201386';
            const currentAccountNumber = currentAccount.slice(0, currentAccount.length - 1);
            const currentAccountDigit = currentAccount.slice(currentAccount.length - 1);

            const verifyDigit = currentAccountDigitGenerate(currentAccountNumber);

            expect(typeof verifyDigit).toBe('string');
            expect(verifyDigit).toHaveLength(1);
            expect(verifyDigit).toBe(currentAccountDigit);
        });
        it('should return true if current account provided is valid', () => {
            const currentAccount = '265201386';

            const isValid = currentAccountValidation(currentAccount);

            expect(isValid).toBeTruthy();
        });
        it('should return false if current account provided is not valid', () => {
            const currentAccount = '265234856';

            const isValid = currentAccountValidation(currentAccount);

            expect(isValid).toBeFalsy();
        });
    });
    describe('Agency tests:', () => {
        it('should return agency number when agencyGenerate() has been called', () => {
            const agencyDigitGenerateSpy = jest.spyOn(mathOperations, 'agencyDigitGenerate');
            mockCrypto.randomInt.mockReturnValueOnce(2).mockReturnValueOnce(5).mockReturnValueOnce(7).mockReturnValueOnce(8);

            const agency = agencyGenerate();

            expect(agency).toHaveLength(5);
            expect(typeof agency).toBe('string');
            expect(mockCrypto.randomInt).toHaveBeenCalledTimes(4);
            expect(agencyDigitGenerateSpy).toHaveBeenCalledTimes(1);
        });
        it('should return agency verify digit', () => {
            const mockAgency = '73778'
            const mockAgencyNumber = mockAgency.slice(0, 4);
            const mockAgencyVerifyDigit = mockAgency.slice(4);

            const verifyDigit = agencyDigitGenerate(mockAgencyNumber);

            expect(typeof verifyDigit).toBe('string');
            expect(verifyDigit).toHaveLength(1);
            expect(verifyDigit).toEqual(mockAgencyVerifyDigit);
        });
        it('should return true when agency provided is valid', () => {
            const mockAgency = '73778';
            const agencyDigitGenerateSpy = jest.spyOn(mathOperations, 'agencyDigitGenerate');

            const validation = agencyValidation(mockAgency);

            expect(agencyDigitGenerateSpy).toHaveBeenCalledTimes(1);
            expect(validation).toBeTruthy();
        });
        it('should return false when agency provided is not valid', () => {
            const mockAgency = '12345';
            const agencyDigitGenerateSpy = jest.spyOn(mathOperations, 'agencyDigitGenerate');

            const validation = agencyValidation(mockAgency);

            expect(agencyDigitGenerateSpy).toHaveBeenCalledTimes(1);
            expect(validation).toBeFalsy();
        });
    });
    describe('CPF test:', () => {
        let cpfDigitGenerateSpy: jest.SpyInstance;

        beforeEach(() => {
            cpfDigitGenerateSpy = jest.spyOn(mathOperations, 'cpfDigitGenerate');
        });
        afterEach(() => jest.restoreAllMocks());
        it('should return true when cpf is valid ', () => {
            const cpf = '04617065040';

            const cpfIsValid = cpfValidation(cpf);

            expect(cpfDigitGenerateSpy).toHaveBeenCalledTimes(1);
            expect(cpfIsValid).toBeTruthy();
        });
        it('should return false when cpf does not have valid length ', () => {
            const cpf = '0461706';

            const cpfIsValid = cpfValidation(cpf);

            expect(cpfDigitGenerateSpy).not.toHaveBeenCalled();
            expect(cpfIsValid).toBeFalsy();
        });
        it('should return false when verify digit cpf is not valid ', () => {
            const cpf = '04617065088';

            const cpfIsValid = cpfValidation(cpf);

            expect(cpfDigitGenerateSpy).toHaveBeenCalledTimes(1);
            expect(cpfIsValid).toBeFalsy();
        });
        it('should return verify digit of the given number', () => {
            const verifyDigit = cpfDigitGenerate('54163198');

            expect(typeof verifyDigit).toBe('string');
            expect(verifyDigit).toHaveLength(2);
            expect(!isNaN(parseInt(verifyDigit))).toBeTruthy();
        });
    });
});