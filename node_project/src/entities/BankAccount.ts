import { randomUUID } from 'crypto';
import { agencyGenerate, currentAccountGenerate } from '../math/mathOperations';

export class BankAccount {
    //TODO Criar um histórico de transações
    bankAccountId: string;
    userId: string;
    currentAccount: string;
    agency: string;
    balance: number;
    pixKeys: {
        cpfKey?: string;
        phoneKey?: string;
        emailKey?: string;
        randomKey?: string;
    }

    constructor(userId: string) {
        this.agency = agencyGenerate();
        this.currentAccount = currentAccountGenerate();
        this.userId = userId;
        this.bankAccountId = randomUUID();
        this.balance = 0;
        this.pixKeys = {};
    };
}