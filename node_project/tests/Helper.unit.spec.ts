import { identifyPixKeyType } from "../src/helper/help";

describe('Helper tests:', () => {
    it('should return CPF key type', async () => {
        const key = '04617065040';

        const keyType = await identifyPixKeyType(key)

        expect(keyType).toBe('CPF');
    });
    it('should return CPF key type', async () => {
        const key = '79981665522';

        const keyType = await identifyPixKeyType(key)

        expect(keyType).toBe('PHONE');
    });
    it('should return EMAIL key type', async () => {
        const key = 'test@gmail.com';

        const keyType = await identifyPixKeyType(key)

        expect(keyType).toBe('EMAIL');
    });
    it('should return EMAIL key type', async () => {
        const key = 'test@gmail.com';

        const keyType = await identifyPixKeyType(key)

        expect(keyType).toBe('EMAIL');
    });
    it('should return RANDOM key type', async () => {
        const key = 'RANDOMPIXKEY';

        const keyType = await identifyPixKeyType(key)

        expect(keyType).toBe('RANDOM');
    });
});