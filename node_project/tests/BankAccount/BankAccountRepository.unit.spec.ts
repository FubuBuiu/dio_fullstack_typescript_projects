import { BankAccount } from './../../src/entities/BankAccount';
import { Firestore } from "firebase/firestore";
import { BankAccountRepository } from "../../src/repositories/BankAccountRepository";
import { getMockFirestoreManager } from "../__mocks__/mockFirestoreFunctions.mock";
import { KeyTypes } from '../../src/services/BankAccountService';

let firestoreManager = getMockFirestoreManager({});

jest.mock('firebase/firestore', () => {
    return {
        limit: jest.fn(() => firestoreManager.limit()),
        and: jest.fn(() => firestoreManager.and()),
        where: jest.fn(() => firestoreManager.where()),
        collection: jest.fn(() => firestoreManager.collection()),
        query: jest.fn(() => firestoreManager.query()),
        doc: jest.fn(() => firestoreManager.doc()),
        setDoc: jest.fn(() => firestoreManager.setDoc()),
        getDoc: jest.fn(() => firestoreManager.getDoc()),
        getDocs: jest.fn(() => firestoreManager.getDocs()),
        deleteDoc: jest.fn(() => firestoreManager.deleteDoc()),
    };
});

describe('BankAccountRepository tests:', () => {
    const bankAccountRepository = new BankAccountRepository({} as Firestore);

    const mockBankAccount = {
        bankAccountId: 'bankAccountId',
        userId: 'userId',
        currentAccount: '123456784',
        agency: '12345',
        balance: 1000,
        pixKeys: {
            cpfKey: 'cpfKey',
            phoneKey: 'phoneKey',
            emailKey: 'emailKey',
            randomKey: 'randomKey',
        }
    };
    describe('- Create bank account', () => {
        it('should create bank account', async () => {
            await bankAccountRepository.createBankAccount(mockBankAccount);

            expect(firestoreManager.setDoc).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Get bank account by current account and agency', () => {

        const currentAccount = '12345678';
        const agency = '01234';

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });
        it('should return bank account if current account and agency exist', async () => {
            firestoreManager = getMockFirestoreManager({
                getDocsReturn: {
                    docs: [
                        {
                            id: 'bankAccountId',
                            data: () => mockBankAccount,
                        }],
                    empty: false
                }
            });

            const bankAccount = await bankAccountRepository.getBankAccountByCurrentAccountAndAgency(currentAccount, agency);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return null if current account and agency do not exist', async () => {
            const bankAccount = await bankAccountRepository.getBankAccountByCurrentAccountAndAgency(currentAccount, agency);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toBeNull();
        });
    });
    describe('- Get bank account by id', () => {

        const bankAccountId = 'bankAccountId';

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });
        it('should return bank account if id exist', async () => {
            firestoreManager = getMockFirestoreManager({
                getDocReturn: {
                    data: () => mockBankAccount,
                    id: bankAccountId,
                    exists: () => true,
                }
            });

            const bankAccount = await bankAccountRepository.getBankAccountById(bankAccountId);

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return null if id does not exist', async () => {
            const bankAccount = await bankAccountRepository.getBankAccountById(bankAccountId);

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(bankAccount).toBeNull();
        });
    });
    describe('- Get bank account by user id', () => {

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });
        it('should return bank account if user id exist', async () => {
            firestoreManager = getMockFirestoreManager({
                getDocsReturn: {
                    docs: [{
                        data: () => mockBankAccount,
                        id: mockBankAccount.bankAccountId,
                        exists: () => true,
                    }],
                    empty: false
                }
            });

            const bankAccount = await bankAccountRepository.getBankAccountByUserId('userId');

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return null if user id does not exist', async () => {
            const bankAccount = await bankAccountRepository.getBankAccountByUserId('userId');

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toBeNull();
        });
    });
    describe('- Get all banks', () => {
        it('should return all bank accounts', async () => {
            firestoreManager = getMockFirestoreManager({ getDocsReturn: { docs: [], empty: false } });

            const allBankAccounts = await bankAccountRepository.getAllBankAccounts();

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(allBankAccounts).toMatchObject<BankAccount[]>(allBankAccounts);
        });
    });
    describe('- Get bank account by PIX key', () => {

        const keyType: KeyTypes = 'CPF';
        const key = 'PixKey';

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });
        it('should return bank account if PIX key exist', async () => {
            firestoreManager = getMockFirestoreManager({
                getDocsReturn: {
                    docs: [
                        {
                            id: mockBankAccount.bankAccountId,
                            data: () => mockBankAccount,
                            exists: () => true,
                        }
                    ],
                    empty: false
                }
            });

            const bankAccount = await bankAccountRepository.getBankAccountByPixKey(keyType, key);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return null if PIX key does exist', async () => {
            const bankAccount = await bankAccountRepository.getBankAccountByPixKey(keyType, key);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(bankAccount).toBeNull();
        });
    });
    describe('- Create PIX key', () => {
        it('should create PIX key', async () => {
            const bankAccountId = 'bankAccountId';
            const pixKeys = { cpfKey: 'cpfKey' };

            await bankAccountRepository.createPixKey(bankAccountId, pixKeys);

            expect(firestoreManager.setDoc).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Delete bank account', () => {
        it('should delete bank account', async () => {
            await bankAccountRepository.deleteBankAccount('bankAccountId');

            expect(firestoreManager.deleteDoc).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Make transfer', () => {
        it('should make transfer', async () => {

            const senderData = { bankAccountId: 'senderBankAccountId', balance: 1000 };
            const receiverData = { bankAccountId: 'receiverBankAccountId', balance: 0 };
            const transferValue = 1000;

            await bankAccountRepository.makeTransfer(senderData, receiverData, transferValue);

            expect(firestoreManager.setDoc).toHaveBeenCalledTimes(2);
        });
    });
});