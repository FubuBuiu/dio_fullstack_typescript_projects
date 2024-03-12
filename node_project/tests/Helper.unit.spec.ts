import { emailValidation, identifyPixKeyType, phoneValidation } from "../src/helper/help";

describe('Helper tests:', () => {
    describe('- identifyPixKeyType', () => {
        it('should return CPF key type', async () => {
            const key = '04617065040';

            const keyType = await identifyPixKeyType(key)

            expect(keyType).toBe('CPF');
        });
        it('should return EMAIL key type', async () => {
            const key = 'test@gmail.com';

            const keyType = await identifyPixKeyType(key)

            expect(keyType).toBe('EMAIL');
        });
        it('should return PHONE key type', async () => {
            const key = '79988888888';

            const keyType = await identifyPixKeyType(key)

            expect(keyType).toBe('PHONE');
        });
        it('should return RANDOM key type', async () => {
            const key = 'RANDOMPIXKEY';

            const keyType = await identifyPixKeyType(key)

            expect(keyType).toBe('RANDOM');
        });
    });
    describe('- emailValidation', () => {
        it('should return true when email provided is valid', () => {
            const isValid = emailValidation("email@gmail.com");

            expect(isValid).toBeTruthy();
        });
        it('should return true when email provided is valid', () => {
            const isValid = emailValidation("email@invalid.com");

            expect(isValid).toBeFalsy();
        });
    });
    describe('- phonelValidation', () => {
        it('should return true when email provided is valid', () => {
            const isValid = phoneValidation("79912453651");

            expect(isValid).toBeTruthy();
        });
        it('should return true when email provided is valid', () => {
            const isValid = phoneValidation("66666666666");

            expect(isValid).toBeFalsy();
        });
    });
});