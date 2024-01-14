export interface IStorageData {
    login: string;
}


export const setLocalStorageValue = (newValue: IStorageData): void => {
    localStorage.setItem('diobank', JSON.stringify(newValue))
};

export const createLocalStorageValue = (): void => {
    const defaultData = {
        login: '',
    }
    setLocalStorageValue(defaultData);
};
export const getLocalStorageValue = (): IStorageData => {
    const data = localStorage.getItem('diobank');

    if (!data) {
        createLocalStorageValue();
        return JSON.parse(localStorage.getItem('diobank')!);
    }
    return JSON.parse(data);
};