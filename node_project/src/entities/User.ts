import { randomUUID } from 'crypto';

export class User {
    id_user: string;
    name: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string) {
        this.id_user = randomUUID();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}