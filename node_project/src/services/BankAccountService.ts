import { KeyTypes } from "../../types/custom-types";
import { ITransactionData } from "../../types/interfaces";
import { firestore } from "../database";
import { BankAccount } from "../entities/BankAccount";
import { User } from "../entities/User";
import { CustomError } from "../errors/CustomError";
import { identifyPixKeyType } from "../helper/help";
import { agencyValidation, currentAccountValidation, randomPixKeyGenerate } from "../math/mathOperations";
import { BankAccountRepository } from "../repositories/BankAccountRepository";

export class BankAccountService {
    bankAccountRepository: BankAccountRepository;

    constructor(bankAccountRepository = new BankAccountRepository(firestore)) {
        this.bankAccountRepository = bankAccountRepository;
    };

    createBankAccount = async (userId: string) => {
        const bankAccount = new BankAccount(userId);
        await this.bankAccountRepository.createBankAccount(bankAccount);
    };

    getBankAccountByCurrentAccountAndAgency = async (currentAccount: string, agency: string): Promise<BankAccount> => {
        const isCurrentAccountValid = currentAccountValidation(currentAccount);

        if (!isCurrentAccountValid) {
            throw new CustomError('Bad Request! Current account is not valid', 400);
        };

        const isAgencyValid = agencyValidation(agency);

        if (!isAgencyValid) {
            throw new CustomError('Bad Request! Agency is not valid', 400);
        };

        const bankAccount = await this.bankAccountRepository.getBankAccountByCurrentAccountAndAgency(currentAccount, agency);

        if (bankAccount === null) {
            throw new CustomError('Data Not Found! Bank account not found', 404);
        };

        return bankAccount;
    };

    getBankAccountById = async (bankAccountId: string): Promise<BankAccount> => {
        const bankAccount = await this.bankAccountRepository.getBankAccountById(bankAccountId);

        if (bankAccount === null) {
            throw new CustomError('Data Not Found! Bank account not found', 404);
        };

        return bankAccount;
    };

    getBankAccountByUserId = async (userId: string): Promise<BankAccount> => {
        const bankAccount = await this.bankAccountRepository.getBankAccountByUserId(userId);

        if (bankAccount === null) {
            throw new CustomError('Data Not Found! Bank account not found', 404);
        };

        return bankAccount;
    };

    getAllBankAccounts = async () => {
        const bankAccounts = await this.bankAccountRepository.getAllBankAccounts();

        return bankAccounts;
    };

    getBankAccountByPixKey = async (keyType: KeyTypes, key: string): Promise<BankAccount> => {
        const bankAccount = await this.bankAccountRepository.getBankAccountByPixKey(keyType, key);

        if (bankAccount === null) {
            throw new CustomError('Data Not Found! Bank account not found', 404);
        };

        return bankAccount;
    };

    createPixKey = async (user: User, keyType: KeyTypes) => {
        enum Key {
            EMAIL = 'emailKey',
            CPF = 'cpfKey',
            PHONE = 'phoneKey',
            RANDOM = 'randomKey'
        }

        const { bankAccountId, pixKeys } = await this.getBankAccountByUserId(user.id);

        if (pixKeys[Key[keyType]] !== undefined) {
            throw new CustomError('Conflict! PIX key already exists.', 409);
        };

        if (keyType === 'CPF') {
            pixKeys.cpfKey = `${user.cpf}`;
        } else if (keyType === 'EMAIL') {
            pixKeys.emailKey = user.email;
        } else if (keyType === 'PHONE') {
            pixKeys.cpfKey = `${user.phone}`;
        } else {
            pixKeys.randomKey = randomPixKeyGenerate(user.id);
        }

        await this.bankAccountRepository.createPixKey(bankAccountId, pixKeys)
    };

    deleteBankAccount = async (bankAccountId: string) => {
        await this.bankAccountRepository.deleteBankAccount(bankAccountId);
    };

    makeTransfer = async (transactionData: ITransactionData) => {

        const { receiver, sender, transferType, transferValue } = transactionData;

        const isSenderCurrentAccount = currentAccountValidation(sender.currentAccount);

        if (!isSenderCurrentAccount) {
            throw new CustomError('Bad Request! Sender current account is not valid', 400);
        };

        const isSenderAgency = agencyValidation(sender.agency);

        if (!isSenderAgency) {
            throw new CustomError('Bad Request! Sender agency is not valid', 400);
        };

        const senderBankAccount = await this.getBankAccountByCurrentAccountAndAgency(sender.currentAccount, sender.agency);

        if (senderBankAccount.balance < transactionData.transferValue) {
            throw new CustomError('Forbidden! Sender does not have enough balance', 403);
        }

        const senderData = {
            bankAccountId: senderBankAccount.bankAccountId,
            balance: senderBankAccount.balance
        };

        let receiverData;

        if (transferType === "DOC" || transferType === "TED") {

            const isReceiverCurrentAccountValid = currentAccountValidation(receiver.currentAccount);

            if (!isReceiverCurrentAccountValid) {
                throw new CustomError('Bad Request! Receiver current account is not valid', 400);
            };

            const isReceiverAgencyValid = agencyValidation(receiver.agency);

            if (!isReceiverAgencyValid) {
                throw new CustomError('Bad Request! Receiver agency is not valid', 400);
            };


            const receiverBanckAccount = await this.getBankAccountByCurrentAccountAndAgency(receiver.currentAccount, receiver.agency);

            receiverData = {
                bankAccountId: receiverBanckAccount.bankAccountId,
                balance: receiverBanckAccount.balance
            }

        } else {
            const keyType: KeyTypes = await identifyPixKeyType(transactionData.receiver.pixKey);

            const receiverBanckAccount: BankAccount = await this.getBankAccountByPixKey(keyType, receiver.pixKey);

            receiverData = {
                bankAccountId: receiverBanckAccount.bankAccountId,
                balance: receiverBanckAccount.balance
            }
        }

        await this.bankAccountRepository.makeTransfer(senderData, receiverData, transferValue);
    };
}