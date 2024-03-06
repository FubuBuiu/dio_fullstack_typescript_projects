import { BankAccount } from "../../src/entities/BankAccount";
import { CustomError } from "../../src/errors/CustomError";
import { BankAccountRepository } from "../../src/repositories/BankAccountRepository";
import { BankAccountService, KeyTypes } from "../../src/services/BankAccountService";
import * as helper from '../../src/helper';

const mockBankAccountRepository: Omit<BankAccountRepository, 'database'> = {
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

const mockMathOperations = {
    agencyValidation: jest.fn(),
    currentAccountValidation: jest.fn(),
}

jest.mock('@/repositories/BankAccountRepository', () => {
    return {
        BankAccountRepository: jest.fn().mockImplementation(() => {
            return mockBankAccountRepository;
        })
    };
});

jest.mock('@/math/mathOperations', () => {
    return {
        agencyGenerate: jest.fn(),
        currentAccountGenerate: jest.fn(),
        agencyValidation: jest.fn().mockImplementation(() => mockMathOperations.agencyValidation()),
        currentAccountValidation: jest.fn().mockImplementation(() => mockMathOperations.currentAccountValidation()),
        randomPixKeyGenerate: jest.fn(),
    };
});

describe('BankAccountService tests:', () => {
    const bankAccountService = new BankAccountService();

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
            await bankAccountService.createBankAccount('userId');

            expect(mockBankAccountRepository.createBankAccount).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Get bank account by current account and agency', () => {

        const currentAccount = '0123456';
        const agency = '01234';

        beforeEach(() => {
            mockMathOperations.currentAccountValidation = jest.fn(() => true);
            mockMathOperations.agencyValidation = jest.fn(() => true);
        });
        it('should return bank account when current account and agency are found', async () => {
            mockBankAccountRepository.getBankAccountByCurrentAccountAndAgency = jest.fn().mockImplementation(() => Promise.resolve(mockBankAccount));

            const bankAccount = await bankAccountService.getBankAccountByCurrentAccountAndAgency(currentAccount, agency);

            expect(mockBankAccountRepository.getBankAccountByCurrentAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(bankAccount).toMatchObject<BankAccount>(mockBankAccount);
        });
        it('should return Bad Request error when current account is not valid', async () => {
            mockMathOperations.currentAccountValidation = jest.fn(() => false);

            await expect(bankAccountService.getBankAccountByCurrentAccountAndAgency(currentAccount, agency)).rejects.toThrow(new CustomError('Bad Request! Current account is not valid', 400));
        });
        it('should return Bad Request error when agency is not valid', async () => {
            mockMathOperations.agencyValidation = jest.fn(() => false);

            await expect(bankAccountService.getBankAccountByCurrentAccountAndAgency(currentAccount, agency)).rejects.toThrow(new CustomError('Bad Request! Agency is not valid', 400));
        });
        it('should return Data Not Found error when bank account not found', async () => {
            mockBankAccountRepository.getBankAccountByCurrentAccountAndAgency = jest.fn(() => Promise.resolve(null));

            await expect(bankAccountService.getBankAccountByCurrentAccountAndAgency(currentAccount, agency)).rejects.toThrow(new CustomError('Data Not Found! Bank account not found', 404));
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
    describe('- Create PIX key', () => {

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
        const mockBankAccountWithoutCpfKey = {
            bankAccountId: 'bankAccountId',
            userId: mockUser.id,
            currentAccount: '123456784',
            agency: '12345',
            balance: 1000,
            pixKeys: {
                phoneKey: 'phoneKey',
                emailKey: 'emailKey',
                randomKey: 'randomKey',
            }
        }

        it('should create PIX key if the key in not exist', async () => {
            jest.spyOn(bankAccountService, 'getBankAccountByUserId').mockImplementation(() => Promise.resolve(mockBankAccountWithoutCpfKey));

            await bankAccountService.createPixKey(mockUser, 'CPF');

            expect(bankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.createPixKey).toHaveBeenCalledTimes(1);
        });
        it('should return Conflict error when the PIX key already exist', async () => {
            jest.spyOn(bankAccountService, 'getBankAccountByUserId').mockImplementation(() => Promise.resolve(mockBankAccount));

            await expect(bankAccountService.createPixKey(mockUser, 'CPF')).rejects.toThrow(new CustomError('Conflict! PIX key already exists.', 409));
            expect(bankAccountService.getBankAccountByUserId).toHaveBeenCalledTimes(1);
            expect(mockBankAccountRepository.createPixKey).not.toHaveBeenCalled();
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

        const mockSenderBankAccount = {
            bankAccountId: 'bankAccountId1',
            userId: 'userId1',
            currentAccount: '12345678',
            agency: '12345',
            balance: 1000,
            pixKeys: {
                cpfKey: 'cpfKey1',
                phoneKey: 'phoneKey1',
                emailKey: 'emailKey1',
                randomKey: 'randomKey1',
            }
        };
        const mockReceiverBankAccount = {
            bankAccountId: 'bankAccountId2',
            userId: 'userId2',
            currentAccount: '87654321',
            agency: '54321',
            balance: 1000,
            pixKeys: {
                cpfKey: 'cpfKey2',
                phoneKey: 'phoneKey2',
                emailKey: 'emailKey2',
                randomKey: 'randomKey2',
            }
        };
        const tedTransactionData: any = {
            sender: {
                agency: mockSenderBankAccount.agency,
                currentAccount: mockSenderBankAccount.currentAccount
            },
            receiver: {
                agency: mockReceiverBankAccount.agency,
                currentAccount: mockReceiverBankAccount.currentAccount,
            },
            transferType: 'TED',
            trasnferValue: 500
        }
        const pixTransactionData: any = {
            sender: {
                agency: mockSenderBankAccount.agency,
                currentAccount: mockSenderBankAccount.currentAccount
            },
            receiver: {
                pixKey: mockReceiverBankAccount.pixKeys.cpfKey
            },
            transferType: 'PIX',
            trasnferValue: 500
        }
        let getBankAccountByCurrentAccountAndAgencySpy: jest.SpyInstance;
        let getBankAccountByPixKeySpy: jest.SpyInstance;
        let identifyPixKeyTypeSpy: jest.SpyInstance;

        beforeEach(() => {
            mockMathOperations.agencyValidation = jest.fn(() => true);
            mockMathOperations.currentAccountValidation = jest.fn(() => true);
            getBankAccountByCurrentAccountAndAgencySpy = jest.spyOn(bankAccountService, 'getBankAccountByCurrentAccountAndAgency');
            getBankAccountByPixKeySpy = jest.spyOn(bankAccountService, 'getBankAccountByPixKey');
            identifyPixKeyTypeSpy = jest.spyOn(helper, 'identifyPixKeyType');
        });
        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        it('should make transfer when transfer type is DOC or TED', async () => {
            getBankAccountByCurrentAccountAndAgencySpy.mockResolvedValueOnce(mockReceiverBankAccount).mockResolvedValueOnce(mockSenderBankAccount);

            await bankAccountService.makeTransfer(tedTransactionData);

            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).toHaveBeenCalledTimes(2);
            expect(mockMathOperations.agencyValidation).toHaveBeenCalledTimes(2);
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(2);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).toHaveBeenCalledTimes(1);
        });
        it('should make transfer when transfer type is PIX', async () => {
            getBankAccountByCurrentAccountAndAgencySpy.mockResolvedValue(mockSenderBankAccount);
            identifyPixKeyTypeSpy.mockImplementation(() => 'CPF');
            getBankAccountByPixKeySpy.mockResolvedValue(mockReceiverBankAccount);

            await bankAccountService.makeTransfer(pixTransactionData);

            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).toHaveBeenCalledTimes(1);
            expect(mockMathOperations.agencyValidation).toHaveBeenCalledTimes(1)
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(1)
            expect(mockBankAccountRepository.makeTransfer).toHaveBeenCalledTimes(1);
        });
        it('should return Bad Request error when sender current account is not valid', async () => {
            mockMathOperations.currentAccountValidation = jest.fn(() => false);

            await expect(bankAccountService.makeTransfer(tedTransactionData)).rejects.toThrow(new CustomError('Bad Request! Sender current account is not valid', 400));
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockMathOperations.agencyValidation).not.toHaveBeenCalled()
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when sender agency is not valid', async () => {
            mockMathOperations.agencyValidation = jest.fn(() => false);

            await expect(bankAccountService.makeTransfer(tedTransactionData)).rejects.toThrow(new CustomError('Bad Request! Sender agency is not valid', 400));
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(1);
            expect(mockMathOperations.agencyValidation).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when receiver current account is not valid', async () => {
            mockMathOperations.currentAccountValidation = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

            await expect(bankAccountService.makeTransfer(tedTransactionData)).rejects.toThrow(new CustomError('Bad Request! Receiver current account is not valid', 400));
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(2);
            expect(mockMathOperations.agencyValidation).toHaveBeenCalledTimes(1);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
        });
        it('should return Bad Request error when receiver agency is not valid', async () => {
            mockMathOperations.agencyValidation = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

            await expect(bankAccountService.makeTransfer(tedTransactionData)).rejects.toThrow(new CustomError('Bad Request! Receiver agency is not valid', 400));
            expect(mockMathOperations.currentAccountValidation).toHaveBeenCalledTimes(2);
            expect(mockMathOperations.agencyValidation).toHaveBeenCalledTimes(2);
            expect(bankAccountService.getBankAccountByPixKey).not.toHaveBeenCalled();
            expect(bankAccountService.getBankAccountByCurrentAccountAndAgency).not.toHaveBeenCalled();
            expect(mockBankAccountRepository.makeTransfer).not.toHaveBeenCalled();
        });
    });
});