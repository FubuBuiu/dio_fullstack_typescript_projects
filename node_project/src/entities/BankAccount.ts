import { randomUUID } from 'crypto';
import { agencyGenerate, accountGenerate } from '../math/mathOperations';
import { ITransactionInformation, PixKeys } from '../../types/interfaces';

export class BankAccount {
    bankAccountId: string;
    userId: string;
    account: string;
    agency: string;
    balance: number;
    pixKeys: PixKeys;
    transactionHistory: ITransactionInformation[];


    constructor(userId: string) {
        this.agency = agencyGenerate();
        this.account = accountGenerate();
        this.userId = userId;
        this.bankAccountId = randomUUID();
        this.balance = 0;
        this.pixKeys = {};
        this.transactionHistory = [];
    };
}