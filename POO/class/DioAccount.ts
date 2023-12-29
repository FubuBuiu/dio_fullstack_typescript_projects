export abstract class DioAccount {
    private readonly name: string;
    private readonly accountNumber: number;
    private balance: number;// saldo
    private status: boolean;

    constructor(name: string, accountNumber: number) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.balance = 0;
        this.status = true;
    }

    deposit = (value: number): void => {
        if (this.validateStatus()) {
            this.setBalance(this.getBalance() + value)
            console.log('Deposito efetuado com sucesso!')
        }
    }
    withdraw = (toWithdraw: number): void => {
        if (this.checkEnoughBalance(toWithdraw) && this.validateStatus()) {
            this.setBalance(this.getBalance() - toWithdraw)
            console.log("Saque efetuado com sucesso!")
        }
    }
    setBalance = (value: number): void => {
        this.balance = value;
    }
    setStatus = (newStatus: boolean): void => {
        this.status = newStatus;
    }
    getBalance = (): number => {
        return this.balance
    }
    getName = (): string => {
        return this.name;
    }
    getAccountNumber = (): number => {
        return this.accountNumber;
    }
    validateStatus = (): boolean => {
        if (this.status) {
            return this.status
        }

        throw new Error('Conta inválida')
    }
    private checkEnoughBalance = (toWithdraw: number): boolean => {
        if (this.balance >= toWithdraw) {

            return true;
        }

        throw new Error('Saldo insuficiente')
    }
}