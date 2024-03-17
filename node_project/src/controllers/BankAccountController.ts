import { ITransferData, IUpdatePixKeyRequest } from './../../types/interfaces';
import { BankAccount } from './../entities/BankAccount';
import { Request, Response } from "express";
import { BankAccountService } from "../services/BankAccountService";
import { CustomError } from '../errors/CustomError';
import { UserService } from '../services/UserService';

export class BankAccountController {
    bankAccountService: BankAccountService;
    userService: UserService;

    constructor(bankAccountService = new BankAccountService(), userService = new UserService()) {
        this.bankAccountService = bankAccountService;
        this.userService = userService;
    }

    makeTranser = async (request: Request, response: Response) => {
        const transferData: ITransferData = request.body;

        if (Object.keys(transferData).length === 0) {
            return response.status(400).json({ message: 'Bad Request! Request body was not provided.' });
        }

        if (transferData.transferValue === undefined || transferData.receiver === undefined || transferData.sender === undefined || transferData.sender.agency === undefined || transferData.sender.account === undefined || transferData.transferType === undefined) {
            return response.status(400).json({ message: 'Bad Request! Request body is missing property.' });
        };

        if (transferData.transferType !== 'PIX' && transferData.transferType !== 'DOC' && transferData.transferType !== 'TED') {
            return response.status(400).json({ message: 'Bad Request! Transfer type not recognized.' });
        };

        if (transferData.transferType === 'PIX' && (transferData.receiver.pixKey === undefined)) {
            return response.status(400).json({ message: 'Bad Request! PIX key not provided.' });
        };

        if ((transferData.transferType === 'DOC' || transferData.transferType === 'TED') && (transferData.receiver.agency === undefined && transferData.receiver.account === undefined)) {
            return response.status(400).json({ message: 'Bad Request! Receiver current account and agency were not provided.' });
        };

        try {
            await this.bankAccountService.makeTransfer(transferData);
            return response.status(200).json({ message: 'Transfer completed successfully!' });
        } catch (error: any) {

            if (error instanceof CustomError) {
                return response.status(error.code).json({ message: error.message });
            };
            return response.status(500).json({ message: error.toString() });
        }

    };

    getBankAccountByAccountAndAgency = async (request: Request, response: Response) => {
        const { account, agency } = request.params;

        if (account === undefined || agency === undefined || account === '' || agency === '') {
            return response.status(400).json({ message: "Bad Request! Request body is missing property." });
        }

        try {
            const bankAccount: BankAccount = await this.bankAccountService.getBankAccountByAccountAndAgency(account, agency);

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