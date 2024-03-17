import { ActionType, KeyTypes } from "../../types/custom-types";
import { ITransactionInformation, ITransferData } from "../../types/interfaces";
import { firestore } from "../database";
import { BankAccount } from "../entities/BankAccount";
import { User } from "../entities/User";
import { CustomError } from "../errors/CustomError";
import { identifyPixKeyType } from "../helper/help";
import { agencyValidation, accountValidation, randomPixKeyGenerate } from "../math/mathOperations";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { UserService } from './UserService';

export class BankAccountService {
    bankAccountRepository: BankAccountRepository;

    constructor(bankAccountRepository = new BankAccountRepository(firestore)) {
        this.bankAccountRepository = bankAccountRepository;
    };

    createBankAccount = async (userId: string) => {
        const bankAccount = new BankAccount(userId);
        await this.bankAccountRepository.createBankAccount(bankAccount);
    };

    getBankAccountByAccountAndAgency = async (account: string, agency: string): Promise<BankAccount> => {
        const isAccountValid = accountValidation(account);

        if (!isAccountValid) {
            throw new CustomError('Bad Request! Current account is not valid', 400);
        };

        const isAgencyValid = agencyValidation(agency);

        if (!isAgencyValid) {
            throw new CustomError('Bad Request! Agency is not valid', 400);
        };

        const bankAccount = await this.bankAccountRepository.getBankAccountByAccountAndAgency(account, agency);

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

    updatePixKey = async (user: User, keyType: KeyTypes, action: ActionType) => {
        enum Key {
            EMAIL = 'emailKey',
            CPF = 'cpfKey',
            PHONE = 'phoneKey',
            RANDOM = 'randomKey'
        }

        //TODO Remover a instancia do UserService do BankAccountController e trazer aqui

        const { bankAccountId, pixKeys } = await this.getBankAccountByUserId(user.id);

        switch (action) {
            case "CREATE":
                if (pixKeys[Key[keyType]] !== undefined) {
                    throw new CustomError('Conflict! PIX key already exists.', 409);
                }
                if (keyType === 'CPF') {
                    pixKeys.cpfKey = `${user.cpf}`;
                } else if (keyType === 'EMAIL') {
                    pixKeys.emailKey = user.email;
                } else if (keyType === 'PHONE') {
                    pixKeys.cpfKey = `${user.phone}`;
                } else {
                    pixKeys.randomKey = randomPixKeyGenerate(user.id);
                }
                break;

            case "DELETE":
                delete pixKeys[Key[keyType]];
                break;
        };

        await this.bankAccountRepository.updatePixKey(bankAccountId, pixKeys);
    };

    deleteBankAccount = async (bankAccountId: string) => {
        await this.bankAccountRepository.deleteBankAccount(bankAccountId);
    };

    makeTransfer = async (transferData: ITransferData) => {

        const { receiver, sender, transferType, transferValue } = transferData;

        const isSenderAccount = accountValidation(sender.account);

        if (!isSenderAccount) {
            throw new CustomError('Bad Request! Sender current account is not valid', 400);
        };

        const isSenderAgency = agencyValidation(sender.agency);

        if (!isSenderAgency) {
            throw new CustomError('Bad Request! Sender agency is not valid', 400);
        };

        const senderBankAccount: BankAccount = await this.getBankAccountByAccountAndAgency(sender.account, sender.agency);

        if (senderBankAccount.balance < transferData.transferValue) {
            throw new CustomError('Forbidden! Sender does not have enough balance', 403);
        };

        const senderData = {
            bankAccountId: senderBankAccount.bankAccountId,
            balance: senderBankAccount.balance
        };

        let receiverBankAccount: BankAccount;
        let receiverData;

        if (transferType === "DOC" || transferType === "TED") {

            const isReceiverAccountValid = accountValidation(receiver.account);

            if (!isReceiverAccountValid) {
                throw new CustomError('Bad Request! Receiver current account is not valid', 400);
            };

            const isReceiverAgencyValid = agencyValidation(receiver.agency);

            if (!isReceiverAgencyValid) {
                throw new CustomError('Bad Request! Receiver agency is not valid', 400);
            };


            receiverBankAccount = await this.getBankAccountByAccountAndAgency(receiver.account, receiver.agency);

            receiverData = {
                bankAccountId: receiverBankAccount.bankAccountId,
                balance: receiverBankAccount.balance
            }

        } else {
            const keyType: KeyTypes = await identifyPixKeyType(transferData.receiver.pixKey);

            receiverBankAccount = await this.getBankAccountByPixKey(keyType, receiver.pixKey);

            receiverData = {
                bankAccountId: receiverBankAccount.bankAccountId,
                balance: receiverBankAccount.balance
            }
        }

        //TODO Verificar se existe uma implementação melhor para gerar a TransactionInformation

        const userService = new UserService()

        const senderUser = await userService.getUser(senderBankAccount.userId);

        const senderTransactionInfo: ITransactionInformation = {
            transactionId: 'T' + Date.now(),
            dateTime: new Date(),
            type: 'TRANSFERENCE',
            category: 'DEBIT',
            value: transferValue,
            currentBalance: senderBankAccount.balance - transferValue,
            description: sender.description ?? '',
            transferType,
            senderOrReceiverAccount: {
                name: senderUser.name,
                account: senderBankAccount.account,
                agency: senderBankAccount.agency
            }
        };

        const receiverUser = await userService.getUser(receiverBankAccount.userId);

        const receiverTransactionInfo: ITransactionInformation = {
            transactionId: 'T' + Date.now(),
            dateTime: new Date(),
            type: 'TRANSFERENCE',
            category: 'CREDIT',
            value: transferValue,
            currentBalance: receiverBankAccount.balance + transferValue,
            description: '',
            transferType,
            senderOrReceiverAccount: {
                name: receiverUser.name,
                account: receiverBankAccount.account,
                agency: receiverBankAccount.agency
            }
        };

        await this.bankAccountRepository.makeTransfer(senderData, receiverData, transferValue);

        await this.bankAccountRepository.updateTransactionHistory(senderBankAccount.bankAccountId, senderTransactionInfo);
        await this.bankAccountRepository.updateTransactionHistory(receiverBankAccount.bankAccountId, receiverTransactionInfo);
    };
}