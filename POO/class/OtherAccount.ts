import { DioAccount } from "./DioAccount";

export class OtherAccount extends DioAccount {
    constructor(name: string, accountNumber: number) {
        super(name, accountNumber)
    }

    deposit = (value: number): void => {
        if (this.validateStatus()) {
            this.setBalance(this.getBalance() + value + 10)
        }
    }
}