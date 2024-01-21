export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    // balance: number;
}

const db = [{
    id: 'fa15d1a6d48',
    name: "João",
    email: "joao@dio.com",
    password: 'joao123',
}];

export class UserService {
    db: IUser[];

    constructor(database = db) {
        this.db = database;
    }

    createUser = (user: Omit<IUser, 'id'>) => {
        const newUser: IUser = {
            id: `${this.db.length + 1}`,
            name: user.name,
            email: user.email,
            password: user.password
        };
        this.db.push(newUser);
    }

    getAllUsers = () => {
        return this.db;
    };

    getUser = (id: string): IUser | undefined => {
        const user = this.db.find((element) => element.id === id);
        return user;
    };

    deleteUser = (id: string): boolean => {
        for (let index = 0; index < this.db.length; index++) {
            if (this.db[index].id === id) {
                this.db.splice(index, index + 1);
                return true;
            }
        }
        return false;
    };
}