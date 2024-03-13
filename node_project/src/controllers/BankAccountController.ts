import { ITransactionData, IUpdatePixKeyRequest } from './../../types/interfaces';
import { BankAccount } from './../entities/BankAccount';
import { Request, Response } from "express";
import { BankAccountService } from "../services/BankAccountService";
import { CustomError } from '../errors/CustomError';
import { UserService } from '../services/UserService';
import { KeyTypes } from '../../types/custom-types';

export class BankAccountController {
    bankAccountService: BankAccountService;
    userService: UserService;

    constructor(bankAccountService = new BankAccountService(), userService = new UserService()) {
        this.bankAccountService = bankAccountService;
        this.userService = userService;
    }

    makeTranser = async (request: Request, response: Response) => {
        const transactionData: ITransactionData = request.body;

        if (Object.keys(transactionData).length === 0) {
            return response.status(400).json({ message: 'Bad Request! Request body was not provided.' });
        }

        if (transactionData.transferValue === undefined || transactionData.receiver === undefined || transactionData.sender === undefined || transactionData.sender.agency === undefined || transactionData.sender.currentAccount === undefined || transactionData.transferType === undefined) {
            return response.status(400).json({ message: 'Bad Request! Request body is missing property.' });
        };

        if (transactionData.transferType !== 'PIX' && transactionData.transferType !== 'DOC' && transactionData.transferType !== 'TED') {
            return response.status(400).json({ message: 'Bad Request! Transfer type not recognized.' });
        };

        if (transactionData.transferType === 'PIX' && (transactionData.receiver.pixKey === undefined)) {
            return response.status(400).json({ message: 'Bad Request! PIX key not provided.' });
        };

        if ((transactionData.transferType === 'DOC' || transactionData.transferType === 'TED') && (transactionData.receiver.agency === undefined && transactionData.receiver.currentAccount === undefined)) {
            return response.status(400).json({ message: 'Bad Request! Receiver current account and agency were not provided.' });
        };

        try {
            await this.bankAccountService.makeTransfer(transactionData);
            return response.status(200).json({ message: 'Transfer completed successfully!' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message });
            };
            return response.status(500).json({ message: error.toString() });
        }

    };

    getBankAccountByCurrentAccountAndAgency = async (request: Request, response: Response) => {
        const { currentAccount, agency } = request.params;

        if (currentAccount === undefined || agency === undefined || currentAccount === '' || agency === '') {
            return response.status(400).json({ message: "Bad Request! Request body is missing property." });
        }

        try {
            const bankAccount: BankAccount = await this.bankAccountService.getBankAccountByCurrentAccountAndAgency(currentAccount, agency);

            return response.status(200).json(bankAccount);
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message });
            };

            return response.status(500).json({ message: error.toString() });
        }
    };

    updatePixKey = async (request: Request, response: Response) => {
        const { userId, keyType, action }: IUpdatePixKeyRequest = request.body;

        if (userId === undefined || keyType === undefined || userId === '' || action === undefined) {
            return response.status(400).json({ message: "Bad Request! Request body is missing property." })
        };

        if (keyType !== 'CPF' && keyType !== 'EMAIL' && keyType !== 'PHONE' && keyType !== 'RANDOM') {
            return response.status(400).json({ message: "Bad Request! The keyType property is not recognized." })
        };

        if (action !== 'DELETE' && action !== 'CREATE') {
            return response.status(400).json({ message: "Bad Request! Unrecognized action type." })
        }


        try {
            const user = await this.userService.getUser(userId);
            await this.bankAccountService.updatePixKey(user, keyType, action);
            return response.status(201).json({ message: 'PIX key created successfully.' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };

            return response.status(500).json({ message: error.toString() });
        }
    };

    getBankAccountById = async (request: Request, response: Response) => {
        const { id } = request.params;

        if (id === undefined || id === '') {
            return response.status(400).json({ message: "Bad Request! Request body is not provided." });
        };

        try {
            const bankAccount = await this.bankAccountService.getBankAccountById(id);

            return response.status(200).json(bankAccount);
        } catch (error: any) {
            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message })
            };
            return response.status(500).json({ message: error.toString() });
        }
    };

    getAllBankAccounts = async (_request: Request, response: Response) => {
        try {
            const bankAccountList = await this.bankAccountService.getAllBankAccounts();
            return response.status(200).json(bankAccountList);
        } catch (error: any) {
            return response.status(500).json({ message: error.toString() })
        }
    };

    // deleteBankAccount = async (request: Request, response: Response) => {
    //     const { bankAccountId } = request.body;

    //     if (bankAccountId === undefined || bankAccountId === '') {
    //         return response.status(400).json({ message: 'Bad Request! Request body is not provided.' });
    //     };

    //     try {
    //         await this.bankAccountService.deleteBankAccount(bankAccountId);
    //         return response.status(200).json({ message: 'Bank account deleted successfully.' });
    //     } catch (error: any) {
    //         if (error instanceof CustomError) {
    //             return response.status(error.code).json({ message: error.message })
    //         };
    //         return response.status(500).json({ message: error.toString() })
    //     }
    // };
}