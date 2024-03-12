import { TransactionCategory, TransactionType, TransferType } from "./custom-types";

//-------------BANK ACCOUNT-------------
export interface ITransactionInformation {
    transactionId: string;
    dateTime: Date;
    type: TransactionType;
    category: TransactionCategory;
    value: number;
    currentBalance: number;
    description?: string;
    transferType?: TransferType;
    senderOrReceiverAccount?: {
        name: string;
        account: string;
        agency: string;
    }
};

export interface ITransactionData {
    transferValue: number;
    sender: {
        currentAccount: string;
        agency: string;
    };
    receiver: {
        currentAccount: string;
        agency: string; pixKey: string;
    };
    transferType: TransferType;
};

export interface PixKeys {
    cpfKey?: string;
    phoneKey?: string;
    emailKey?: string;
    randomKey?: string;
}

//-------------USER-------------

export interface IAdress {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
}