import { BankAccount } from "../../src/entities/BankAccount";
import { CustomError } from "../../src/errors/CustomError";
import { BankAccountRepository } from "../../src/repositories/BankAccountRepository";
import { BankAccountService } from "../../src/services/BankAccountService";
import * as mathOperations from '../../src/math/mathOperations'
import * as helper from '../../src/helper/help';
import { KeyTypes } from "../../types/custom-types";
import { ITransferData } from "../../types/interfaces";
import { UserService } from "../../src/services/UserService";
import { User } from "../../src/entities/User";

const mockBankAccountRepository: Omit<BankAccountRepository, 'database'> = {
    createBankAccount: jest.fn(),
    getBankAccountByAccountAndAgency: jest.fn(),
    getBankAccountById: jest.fn(),
    getBankAccountByUserId: jest.fn(),
    getAllBankAccounts: jest.fn(),
    getBankAccountByPixKey: jest.fn(),
    updatePixKey: jest.fn(),
    deleteBankAccount: jest.fn(),
    makeTransfer: jest.fn(),
    updateTransactionHistory: jest.fn()
};

const mockMathOperations = {
    agencyValidation: jest.fn(),
    accountValidation: jest.fn(),
}
const mockUserService = {
    getUser: jest.fn(),
};

jest.mock('@/repositories/BankAccountRepository', () => {
    return {
        BankAccountRepository: jest.fn().mockImplementation(() => {
            return mockBankAccountRepository;
        })
    };
});
jest.mock('@/services/UserService', () => {
    return {
        UserService: jest.fn(() => mockUserService)
    };
});

describe('BankAccountService tests:', () => {
    const bankAccountService = new BankAccountService();

    const mockBankAccount = {
        bankAccountId: 'bankAccountId',
        userId: 'userId',
        account: '9113111159',
        agency: '59868',
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
        jest.restoreAllMocks();
    });

    describe('- Create bank account', () => {
        it('should create bank account', async () => {
            await bankAccountService.createBankAccount('userId');

            expect(mockBankAccountRepository.createBankAccount).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Get bank account by account and agency', () => {

        let accountValidationSpy: jest.SpyInstance;
        let agencyValidationSpy: jest.SpyInstance;

        beforeEach(() => {
            accountValidationSpy = jest.spyOn(mathOperations, 'accountValidation');
            agencyValidationSpy = jest.spyOn(mathOperations, 'agencyValidation');
        });
        it('should return bank account when account and agency are found', async () => {
            mockBankAccountRepository.getBankAccountByAccountAndAgency = jest.fn().mockResolvedValue(mockBankAccount);

            const bankAccount = await bankAccountService.getBankAccountByAccountAndAgency(mockBankAccount.account, mockBankAccount.agency);

            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return Bad Request error when account is not valid', async () => {

            await expect(bankAccountService.getBankAccountByAccountAndAgency('123456789', '12345')).rejects.toThrow(new CustomError('Bad Request! Current account is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when agency is not valid', async () => {
            mockMathOperations.agencyValidation = jest.fn(() => false);

            await expect(bankAccountService.getBankAccountByAccountAndAgency(mockBankAccount.account, '12345')).rejects.toThrow(new CustomError('Bad Request! Agency is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
        });
        it('should return Data Not Found error when bank account not found', async () => {
            mockBankAccountRepository.getBankAccountByAccountAndAgency = jest.fn().mockResolvedValue(null);

            await expect(bankAccountService.getBankAccountByAccountAndAgency(mockBankAccount.account, mockBankAccount.agency)).rejects.toThrow(new CustomError('Data Not Found! Bank account not found', 404));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Get bank account by id', () => {

        const bankAccountId = 'bankAccountId';

        it('should return bank account when id is found', async () => {
            mockBankAccountRepository.getBankAccountById = jest.fn(() => Promise.resolve(mockBankAccount));

            const bankAccount = await bankAccountService.getBankAccountById(bankAccountId);

            expect(mockBankAccountRepository.getBankAccountById).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return Data Not Found error when bank account id is not found', async () => {
            mockBankAccountRepository.getBankAccountById = jest.fn(() => Promise.resolve(null));

            await expect(bankAccountService.getBankAccountById(bankAccountId)).rejects.toThrow(new CustomError('Data Not Found! Bank account not found', 404));
        });
    });
    describe('- Get bank account by user id', () => {
        const userId = 'userId';

        it('should return bank account when user id is found', async () => {
            mockBankAccountRepository.getBankAccountByUserId = jest.fn(() => Promise.resolve(mockBankAccount));

            const bankAccount = await bankAccountService.getBankAccountByUserId(userId);

            expect(mockBankAccountRepository.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return Data Not Found error when user id is not found', async () => {
            mockBankAccountRepository.getBankAccountByUserId = jest.fn(() => Promise.resolve(null));

            await expect(bankAccountService.getBankAccountByUserId(userId)).rejects.toThrow(new CustomError('Data Not Found! Bank account not found', 404));
        });
    });
    describe('- Get all bank accounts', () => {

        it('should return all bank accounts', async () => {
            mockBankAccountRepository.getAllBankAccounts = jest.fn(() => Promise.resolve([]));

            const allBankAccounts = await bankAccountService.getAllBankAccounts();

            expect(mockBankAccountRepository.getAllBankAccounts).toHaveBeenCalledTimes(1);
            expect(allBankAccounts).toMatchObject<BankAccount[]>(Array<BankAccount>());
        });
    });
    describe('- Get bank account by PIX key', () => {

        const pixKey = 'pixKey';
        const keyType: KeyTypes = 'CPF';

        it('should return bank account when id is found', async () => {
            mockBankAccountRepository.getBankAccountByPixKey = jest.fn(() => Promise.resolve(mockBankAccount));

            const bankAccount = await bankAccountService.getBankAccountByPixKey(keyType, pixKey);

            expect(mockBankAccountRepository.getBankAccountByPixKey).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.getBankAccountByPixKey).toHaveBeenCalledWith(keyType, pixKey);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return Data Not Found error when bank account id is not found', async () => {
            mockBankAccountRepository.getBankAccountByPixKey = jest.fn(() => Promise.resolve(null));

            await expect(bankAccountService.getBankAccountByPixKey(keyType, pixKey)).rejects.toThrow(new CustomError('Data Not Found! Bank account not found', 404));
            expect(mockBankAccountRepository.getBankAccountByPixKey).toHaveBeenCalledWith(keyType, pixKey);
            expect(mockBankAccountRepository.getBankAccountByPixKey).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Update PIX keys', () => {

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
            phone: '99999999999',
            email: 'user@dio.com',
            password: 'user123',
        };
        const mockBankAccountWithoutCpfKey = {
            bankAccountId: 'bankAccountId',
            userId: mockUser.id,
            account: '123456784',
            agency: '12345',
            balance: 1000,
            pixKeys: {
                phoneKey: 'phoneKey',
                emailKey: 'emailKey',
                randomKey: 'randomKey',
            },
            transactionHistory: [],
        }

        it('should create PIX key if the key in not exist', async () => {
            jest.spyOn(bankAccountService, 'getBankAccountByUserId').mockImplementation(() => Promise.resolve(mockBankAccountWithoutCpfKey));

            await bankAccountService.updatePixKey(mockUser, 'CPF', 'CREATE');

            expect(bankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.updatePixKey).toHaveBeenCalledTimes(1);
        });
        it('should return Conflict error when trying to create a PIX key that already exist', async () => {
            jest.spyOn(bankAccountService, 'getBankAccountByUserId').mockImplementation(() => Promise.resolve(mockBankAccount));

            await expect(bankAccountService.updatePixKey(mockUser, 'CPF', 'CREATE')).rejects.toThrow(new CustomError('Conflict! PIX key already exists.', 409));
            expect(bankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.updatePixKey).not.toHaveBeenCalled();
        });
        it('should delete PIX key', async () => {
            jest.spyOn(bankAccountService, 'getBankAccountByUserId').mockImplementation(() => Promise.resolve(mockBankAccount));

            await bankAccountService.updatePixKey(mockUser, "PHONE", "DELETE");

            expect(bankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.updatePixKey).toHaveBeenCalledWith(mockBankAccount.bankAccountId, {
                cpfKey: 'cpfKey',
                emailKey: 'emailKey',
                randomKey: 'randomKey',
            })
        });
    });
    describe('- Delete bank account', () => {

        const bankAccountId = 'bankAccountId';

        afterEach(() => jest.restoreAllMocks())
        it('should delete bank account if does exist', async () => {

            await bankAccountService.deleteBankAccount(bankAccountId);

            expect(mockBankAccountRepository.deleteBankAccount).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.deleteBankAccount).toHaveBeenCalledWith(bankAccountId);
        });
    });
    describe('- Make transfer', () => {

        const mockSenderBankAccount: BankAccount = {
            bankAccountId: 'bankAccountId1',
            userId: 'userId1',
            account: '9113111159',
            agency: '59868',
            balance: 1000,
            pixKeys: {
                cpfKey: 'cpfKey1',
                phoneKey: 'phoneKey1',
                emailKey: 'emailKey1',
                randomKey: 'randomKey1',
            },
            transactionHistory: []
        };
        const mockReceiverBankAccount: BankAccount = {
            bankAccountId: 'bankAccountId2',
            userId: 'userId2',
            account: '12848229687',
            agency: '97831',
            balance: 1000,
            pixKeys: {
                cpfKey: 'cpfKey2',
                phoneKey: 'phoneKey2',
                emailKey: 'emailKey2',
                randomKey: 'randomKey2',
            },
            transactionHistory: []
        };
        const mockUser: User = {
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
            phone: '99999999999',
            email: 'user@dio.com',
            password: 'user123',
        };
        let tedTransferData: any;
        let pixTransactionData: any;
        let getBankAccountByAccountAndAgencySpy: jest.SpyInstance;
        let getBankAccountByPixKeySpy: jest.SpyInstance;
        let identifyPixKeyTypeSpy: jest.SpyInstance;
        let accountValidationSpy: jest.SpyInstance;
        let agencyValidationSpy: jest.SpyInstance;

        beforeEach(() => {
            tedTransferData = {
                sender: {
                    agency: mockSenderBankAccount.agency,
                    account: mockSenderBankAccount.account
                },
                receiver: {
                    agency: mockReceiverBankAccount.agency,
                    account: mockReceiverBankAccount.account,
                },
                transferType: 'TED',
                transferValue: 500
            }
            pixTransactionData = {
                sender: {
                    agency: mockSenderBankAccount.agency,
                    account: mockSenderBankAccount.account
                },
                receiver: {
                    pixKey: mockReceiverBankAccount.pixKeys.cpfKey
                },
                transferType: 'PIX',
                transferValue: 500
            }
            getBankAccountByAccountAndAgencySpy = jest.spyOn(bankAccountService, 'getBankAccountByAccountAndAgency');
            getBankAccountByPixKeySpy = jest.spyOn(bankAccountService, 'getBankAccountByPixKey');
            identifyPixKeyTypeSpy = jest.spyOn(helper, 'identifyPixKeyType');
            accountValidationSpy = jest.spyOn(mathOperations, 'accountValidation');
            agencyValidationSpy = jest.spyOn(mathOperations, 'agencyValidation');
            mockUserService.getUser = jest.fn();
        });

        it('should make transfer when transfer type is DOC or TED', async () => {
            getBankAccountByAccountAndAgencySpy.mockResolvedValueOnce(mockSenderBankAccount).mockResolvedValueOnce(mockReceiverBankAccount);
            mockUserService.getUser = jest.fn().mockResolvedValue(mockUser);

            await bankAccountService.makeTransfer(tedTransferData);

            expect(bankAccountService.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(2);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(2);
            expect(accountValidationSpy).toHaveBeenCalledTimes(2);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).toHaveBeenCalledTimes(1);
            expect(mockUserService.getUser).toHaveBeenCalledTimes(2);
            expect(mockBankAccountRepository.updateTransactionHistory).toHaveBeenCalledTimes(2);
        });
        it('should make transfer when transfer type is PIX', async () => {
            getBankAccountByAccountAndAgencySpy.mockResolvedValue(mockSenderBankAccount);
            identifyPixKeyTypeSpy.mockImplementation(() => 'CPF');
            getBankAccountByPixKeySpy.mockResolvedValue(mockReceiverBankAccount);
            mockUserService.getUser = jest.fn().mockResolvedValue(mockUser);

            await bankAccountService.makeTransfer(pixTransactionData);

            expect(bankAccountService.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1)
            expect(accountValidationSpy).toHaveBeenCalledTimes(1)
            expect(mockBankAccountRepository.makeTransfer).toHaveBeenCalledTimes(1);
            expect(mockUserService.getUser).toHaveBeenCalledTimes(2);
            expect(mockBankAccountRepository.updateTransactionHistory).toHaveBeenCalledTimes(2);
        });
        it('should return Bad Request error when sender current account is not valid', async () => {
            tedTransferData.sender.account = '123456789';

            await expect(bankAccountService.makeTransfer(tedTransferData)).rejects.toThrow(new CustomError('Bad Request! Sender current account is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByAccountAndAgency).not.toHaveBeenCalled();
            expect(agencyValidationSpy).not.toHaveBeenCalled()
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
            expect(mockUserService.getUser).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.updateTransactionHistory).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when sender agency is not valid', async () => {
            tedTransferData.sender.agency = '12345';

            await expect(bankAccountService.makeTransfer(tedTransferData)).rejects.toThrow(new CustomError('Bad Request! Sender agency is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByAccountAndAgency).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
            expect(mockUserService.getUser).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.updateTransactionHistory).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when receiver current account is not valid', async () => {
            getBankAccountByAccountAndAgencySpy.mockResolvedValueOnce(mockSenderBankAccount).mockResolvedValueOnce(mockReceiverBankAccount);
            tedTransferData.receiver.account = '123456789';

            await expect(bankAccountService.makeTransfer(tedTransferData)).rejects.toThrow(new CustomError('Bad Request! Receiver current account is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(2);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
            expect(mockUserService.getUser).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.updateTransactionHistory).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when receiver agency is not valid', async () => {
            getBankAccountByAccountAndAgencySpy.mockResolvedValueOnce(mockSenderBankAccount).mockResolvedValueOnce(mockReceiverBankAccount);
            tedTransferData.receiver.agency = '12345';

            await expect(bankAccountService.makeTransfer(tedTransferData)).rejects.toThrow(new CustomError('Bad Request! Receiver agency is not valid', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(2);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(2);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
            expect(mockUserService.getUser).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.updateTransactionHistory).not.toHaveBeenCalled();
        });
        it('should return Forbidden error when sender does not have enough balance to realize the tranfer', async () => {
            getBankAccountByAccountAndAgencySpy.mockResolvedValueOnce(mockSenderBankAccount).mockResolvedValueOnce(mockReceiverBankAccount);
            tedTransferData.transferValue = 5000;

            await expect(bankAccountService.makeTransfer(tedTransferData)).rejects.toThrow(new CustomError('Forbidden! Sender does not have enough balance', 400));
            expect(accountValidationSpy).toHaveBeenCalledTimes(1);
            expect(agencyValidationSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
            expect(mockUserService.getUser).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.updateTransactionHistory).not.toHaveBeenCalled();
        });
    });
});