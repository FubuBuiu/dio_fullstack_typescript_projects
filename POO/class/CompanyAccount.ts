import { DioAccount } from "./DioAccount";

export class CompanyAccount extends DioAccount {
    constructor(name: string, accountNumber: number) {
        super(name, accountNumber,)
    }

    getLoan = (value: number): void => {
        if (this.validateStatus()) {
            this.setBalance(this.getBalance() + value)
            console.log('Empréstimo realizado com sucesso!')
        }
    }
}