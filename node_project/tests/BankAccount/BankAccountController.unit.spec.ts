import { BankAccountController } from "../../src/controllers/BankAccountController";
import { BankAccount } from "../../src/entities/BankAccount";
import { BankAccountService } from "../../src/services/BankAccountService";
import { UserService } from "../../src/services/UserService";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

const mockBankAccountService: Omit<BankAccountService, 'bankAccountRepository'> = {
    createBankAccount: jest.fn(),
    getBankAccountByCurrentAccountAndAgency: jest.fn(),
    getBankAccountById: jest.fn(),
    getBankAccountByUserId: jest.fn(),
    getAllBankAccounts: jest.fn(),
    getBankAccountByPixKey: jest.fn(),
    createPixKey: jest.fn(),
    deleteBankAccount: jest.fn(),
    makeTransfer: jest.fn()
};

const mockUserService: Partial<UserService> = {
    getUser: jest.fn(),
};

jest.mock('@/services/BankAccountService', () => {
    return {
        BankAccountService: jest.fn(() => mockBankAccountService)
    };
});

jest.mock('@/services/UserService', () => {
    return {
        UserService: jest.fn(() => mockUserService)
    };
});

describe('BankAccountController tests:', () => {
    const bankAccountController = new BankAccountController();
    const mockResponse = makeMockResponse();
    const mockBankAccount: BankAccount = {
        bankAccountId: 'bankAccountId',
        userId: 'userId',
        account: '123456784',
        agency: '12345',
        balance: 1000,
        pixKeys: {
            cpfKey: 'cpfKey',
            phoneKey: 'phoneKey',
            emailKey: 'emailKey',
            randomKey: 'randomKey',
        },
        transactionHistory: [],
    };

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    describe('- Testing the makeTransfer service', () => {
        it('should make transfer when transfer type is TED or DOC', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockBankAccountService.makeTransfer).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'Transfer completed successfully!' });
        });
        it('should make transfer when transfer type is PIX', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        pixKey: 'pixKey'
                    },
                    transferType: 'PIX',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockBankAccountService.makeTransfer).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'Transfer completed successfully!' });
        });
        it('should return Bad Request error when body is empty', async () => {
            const mockRequest = makeMockRequest({});

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body was not provided.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when transferValue is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when sender is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when receiver is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when transfer type is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when sender current account is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when sender agency is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Request body is missing property.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when transfer type not recognized', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'nonExistentTransferType',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Transfer type not recognized.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when transfer type is PIX and pix key not provided', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {},
                    transferType: 'PIX',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! PIX key not provided.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when transfer type is DOC or TED and receiver current account and agency are not provided', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {},
                    transferType: 'DOC',
                }
            });

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad Request! Receiver current account and agency were not provided.' });
            expect(mockBankAccountService.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return status code 500 for another error', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    transferValue: 500,
                    sender: {
                        currentAccount: '12345678',
                        agency: '12345',
                    },
                    receiver: {
                        currentAccount: '87654321',
                        agency: '54321',
                    },
                    transferType: 'TED',
                }
            });
            mockBankAccountService.makeTransfer = jest.fn().mockRejectedValue(new Error('Any other error'));

            await bankAccountController.makeTranser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(500);
            expect(mockResponse.state.json).toMatchObject({ message: 'Error: Any other error' });
        });
    });
    describe('- Testing the getBankAccountByCurrentAccountAndAgency service', () => {
        it('should return status code 200 when request body is correct', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    currentAccount: '12345678',
                    agency: '12345',
                }
            });
            mockBankAccountService.getBankAccountByCurrentAccountAndAgency = jest.fn().mockResolvedValue(mockBankAccount);

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountByCurrentAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject(mockBankAccount);
        });
        it('should return status code 400 when current account is undefined', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    agency: '12345',
                }
            });

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when agency is undefined', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    currentAccount: '12345678',
                }
            });

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when current account is empty string', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    currentAccount: '',
                    agency: '12345',
                }
            });

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when agency is empty string', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    currentAccount: '0123456789',
                    agency: '',
                }
            });

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 500 for another error', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    currentAccount: '12345678',
                    agency: '12345',
                }
            });
            mockBankAccountService.getBankAccountByCurrentAccountAndAgency = jest.fn().mockRejectedValue(new Error('Any other error'));

            await bankAccountController.getBankAccountByCurrentAccountAndAgency(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(500);
            expect(mockResponse.state.json).toMatchObject({ message: 'Error: Any other error' });
        });
    });
    describe('- Testing the createPixKey service', () => {
        const mockUser = {
            id: '12345',
            name: 'User name',
            cpf: '11111111111',
            adress: {
                street: 'Street',
                neighborhood: 'Neighborhood',
                city: 'City',
                state: 'State',
                zipCode: 'Zip Code',
                complement: 'Complement'
            },
            phone: 99999999999,
            email: 'user@dio.com',
            password: 'user123',
        };
        it('should return status code 201 when request body is correct', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    userId: 'userId',
                    keyType: 'CPF'
                }
            });
            mockUserService.getUser = jest.fn().mockResolvedValue(mockUser);

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockUserService.getUser).toHaveBeenCalled();
            expect(mockBankAccountService.createPixKey).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(201);
            expect(mockResponse.state.json).toMatchObject({ message: 'PIX key created successfully.' });
        });
        it('should return status code 400 when userId is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    keyType: 'CPF'
                }
            });

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when userId is empty string', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    userId: '',
                    keyType: 'CPF'
                }
            });

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when keyType is undefined', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    userId: 'userId'
                }
            });

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is missing property." });
        });
        it('should return status code 400 when keyType not recognized', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    userId: 'userId',
                    keyType: 'notRecognizedKey'
                }
            });

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! The keyType property is not recognized." });
        });
        it('should return status code 500 for another error', async () => {
            const mockRequest = makeMockRequest({
                body: {
                    userId: 'userId',
                    keyType: 'CPF'
                }
            });
            mockBankAccountService.createPixKey = jest.fn().mockRejectedValue(new Error('Any other error'));

            await bankAccountController.createPixKey(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(500);
            expect(mockResponse.state.json).toMatchObject({ message: 'Error: Any other error' });
        });
    });
    describe('- Testing the getBankAccountById service', () => {
        it('should return status code 200 when request body is correct', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    id: 'bankAccountId'
                }
            });
            mockBankAccountService.getBankAccountById = jest.fn().mockResolvedValue(mockBankAccount);

            await bankAccountController.getBankAccountById(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountById).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return status code 400 when bankAccountId is undefined', async () => {
            const mockRequest = makeMockRequest({
                params: {
                }
            });

            await bankAccountController.getBankAccountById(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountById).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is not provided." });
        });
        it('should return status code 400 when bankAccountId is a string empty', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    id: ''
                }
            });

            await bankAccountController.getBankAccountById(mockRequest, mockResponse);

            expect(mockBankAccountService.getBankAccountById).not.toHaveBeenCalled();
            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: "Bad Request! Request body is not provided." });
        });
        it('should return status code 500 for another error', async () => {
            const mockRequest = makeMockRequest({
                params: {
                    id: 'bankAccountId'
                }
            });
            mockBankAccountService.getBankAccountById = jest.fn().mockRejectedValue(new Error('Any other error'));

            await bankAccountController.getBankAccountById(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(500);
            expect(mockResponse.state.json).toMatchObject({ message: 'Error: Any other error' });
        });
    });
    describe('- Testing the getAllBankAccounts service', () => {
        it('should return status code 200', async () => {
            mockBankAccountService.getAllBankAccounts = jest.fn().mockResolvedValue(Array<BankAccount>());
            const mockRequest = makeMockRequest({});

            await bankAccountController.getAllBankAccounts(mockRequest, mockResponse);

            expect(mockBankAccountService.getAllBankAccounts).toHaveBeenCalledTimes(1);
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject(Array<BankAccount>());
        });
        it('should return status code 500 for another error', async () => {
            mockBankAccountService.getAllBankAccounts = jest.fn().mockRejectedValue(new Error('Any other error'));
            const mockRequest = makeMockRequest({});

            await bankAccountController.getAllBankAccounts(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(500);
            expect(mockResponse.state.json).toMatchObject({ message: 'Error: Any other error' });
        });
    });
});