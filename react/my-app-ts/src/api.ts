export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    balance: number;
}

const userList: IUser[] = [
    {
        id: "J3q7FQ43AsvdF0O",
        name: "Username",
        email: "user@dio.com",
        password: "user123",
        balance: 2000,
    },
    {
        id: "ztUM6XsBz5FRsV",
        name: "Admin name",
        email: "admin@dio.com",
        password: "admin123",
        balance: 10000,
    },
]

export const loginValidateApi = async (login: { email: string; password: string }): Promise<string | undefined> => {
    return new Promise((resolve) => {
        let response: string | undefined = undefined;
        for (const user of userList) {
            if (user.email === login.email && user.password === login.password) {
                response = user.id;
                break;
            }
        }
        setTimeout(() => {
            resolve(response);
        }, 3000)
    });
};

export const getUserInformationApi = (id: string): Promise<IUser | undefined> => {
    return new Promise((resolve) => {
        let response: IUser | undefined = undefined;
        for (const user of userList) {
            if (user.id === id) {
                response = user;
                break;
            }
        }
        setTimeout(() => {
            return resolve(response);
        }, 3000);
    });
};