import { BankAccount } from "../entities/BankAccount";
import { Firestore, and, collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore";
import { PixKeys } from "../../types/interfaces";
import { KeyTypes } from "../../types/custom-types";

export class BankAccountRepository {
    database: Firestore;

    constructor(database: Firestore) {
        this.database = database;
    };

    createBankAccount = async (bankAccount: BankAccount) => {
        const { bankAccountId, ...bankAccountData } = bankAccount;
        await setDoc(doc(this.database, 'bankAccounts', bankAccountId), {
            ...bankAccountData
        });
    };

    getBankAccountByCurrentAccountAndAgency = async (currentAccount: string, agency: string): Promise<BankAccount | null> => {
        const q = query(collection(this.database, 'bankAccounts'), and(where("currentAccount", "==", currentAccount), where("agency", "==", agency)));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        };

        const document = snapshot.docs[0];

        return {
            bankAccountId: document.id,
            userId: document.data().userId,
            account: document.data().account,
            agency: document.data().agency,
            balance: document.data().balance,
            pixKeys: document.data().pixKeys,
            transactionHistory: document.data().transactionHistory
        };
    };

    getBankAccountById = async (bankAccountId: string): Promise<BankAccount | null> => {
        const document = await getDoc(doc(this.database, 'bankAccounts', bankAccountId));

        if (document.exists()) {
            return {
                bankAccountId: document.id,
                userId: document.data().userId,
                account: document.data().account,
                agency: document.data().agency,
                balance: document.data().balance,
                pixKeys: document.data().pixKeys,
                transactionHistory: document.data().transactionHistory
            };
        };

        return null;
    };

    getBankAccountByUserId = async (userId: string): Promise<BankAccount | null> => {
        const q = query(collection(this.database, 'bankAccounts'), where('userId', '==', userId), limit(1));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        };

        const document = snapshot.docs[0];

        return {
            bankAccountId: document.id,
            userId: document.data().userId,
            account: document.data().account,
            agency: document.data().agency,
            balance: document.data().balance,
            pixKeys: document.data().pixKeys,
            transactionHistory: document.data().transactionHistory
        };
    };

    getAllBankAccounts = async (): Promise<BankAccount[]> => {
        const snapshot = await getDocs(collection(this.database, 'bankAccounts'));

        return snapshot.docs.map((document) => {
            return {
                bankAccountId: document.id,
                userId: document.data().userId,
                account: document.data().account,
                agency: document.data().agency,
                balance: document.data().balance,
                pixKeys: document.data().pixKeys,
                transactionHistory: document.data().transactionHistory
            };
        });
    };

    getBankAccountByPixKey = async (keyType: KeyTypes, key: string): Promise<BankAccount | null> => {
        enum Key {
            EMAIL = 'emailKey',
            CPF = 'cpfKey',
            PHONE = 'phoneKey',
            RANDOM = 'randomKey'
        }

        const q = query(collection(this.database, 'bankAccounts'), where(`pixKeys.${Key[keyType]}`, "==", key), limit(1));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        };

        const document = snapshot.docs[0];

        return {
            bankAccountId: document.id,
            userId: document.data().userId,
            account: document.data().account,
            agency: document.data().agency,
            balance: document.data().balance,
            pixKeys: document.data().pixKeys,
            transactionHistory: document.data().transactionHistory
        };
    };

    updatePixKey = async (bankAccountId: string, pixKeys: PixKeys) => {
        await updateDoc(doc(this.database, 'bankAccounts', bankAccountId), {
            pixKeys
        });
    };

    deleteBankAccount = async (bankAccountId: string) => {
        const document = doc(this.database, 'bankAccounts', bankAccountId);
        await deleteDoc(document);
    };

    makeTransfer = async (senderData: { bankAccountId: string; balance: number }, receiverData: { bankAccountId: string; balance: number }, transferValue: number) => {
        await updateDoc(doc(this.database, 'bankAccounts', senderData.bankAccountId), {
            balance: senderData.balance - transferValue,
        });
        await updateDoc(doc(this.database, 'bankAccounts', receiverData.bankAccountId), {
            balance: receiverData.balance + transferValue,
        });
    };
}