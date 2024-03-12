import { randomUUID } from 'crypto';
import { IAdress } from '../../types/interfaces';

export class User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    cpf: string;
    adress?: IAdress;

    constructor(name: string, cpf: string, email: string, password: string) {
        this.id = randomUUID();
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
    }
}