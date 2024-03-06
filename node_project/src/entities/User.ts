import { randomUUID } from 'crypto';

export class User {
    id: string;
    name: string;
    email: string;
    phone?: number;
    password: string;
    cpf: string;
    adress?: {
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        complement?: string;
    };

    constructor(name: string, cpf: string, email: string, password: string) {
        this.id = randomUUID();
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
    }
}