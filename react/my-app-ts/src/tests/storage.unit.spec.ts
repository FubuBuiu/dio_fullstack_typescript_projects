import { IStorageData, createLocalStorageValue, getLocalStorageValue, setLocalStorageValue } from '../services/storage';

const diobank: IStorageData = { login: '' }

interface IStore {
    [key: string]: string;
}
interface ILocalStorageMock {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    clear: () => void;
};

describe('Local Storage tests', () => {
    let store: IStore = {};
    let localStorageMock: ILocalStorageMock;
    beforeEach(() => {
        localStorageMock = {
            getItem: jest.fn((key: string): string | null => {
                return store[key];
            }),
            setItem: jest.fn((key: string, value: string): void => {
                store[key] = value.toString();
            }),
            clear: jest.fn((): void => { store = {} }),
        }
        Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    });
    afterEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        Object.defineProperty(global, 'localStorage', { value: null, writable: true });

    })

    it('should create data in local storage when createLocalStorageValue() called', () => {
        expect(Object.keys(store).length).toBe(0);
        createLocalStorageValue();
        expect(Object.keys(store).length).toBe(1);
        expect(localStorageMock.getItem('diobank')).toEqual(JSON.stringify(diobank));
        expect(localStorageMock.setItem).toBeCalledTimes(1);
        expect(localStorageMock.setItem).toBeCalledWith('diobank', JSON.stringify(diobank));

    });

    it('should get data from local storage when getLocalStorageValue() called', () => {
        createLocalStorageValue();
        const data = getLocalStorageValue();
        expect(localStorageMock.getItem).toBeCalledTimes(1);
        expect(typeof data === 'object').toBe(true);
        expect(data).toEqual(diobank);
    });

    it('should create data in local storage when getLocalStorageValue() called  and local storage is empty', () => {
        expect(Object.keys(store).length).toBe(0);
        const data = getLocalStorageValue();
        expect(Object.keys(store).length).toBe(1);
        expect(localStorageMock.setItem).toBeCalledTimes(1);
        expect(localStorageMock.getItem).toBeCalledTimes(2);
        expect(data).toEqual(diobank);
    });

    it('should change data value that already exist in local storage when setLocalStorageValue() called', () => {
        store = {
            diobank: "{login:''}"
        }
        setLocalStorageValue({ login: '1234' });
        const data = getLocalStorageValue();
        expect(Object.keys(store).length).toBe(1);
        expect(localStorageMock.setItem).toBeCalledTimes(1);
        expect(localStorageMock.getItem).toBeCalledTimes(1);
        expect(data).toEqual({ login: '1234' });
    });
});