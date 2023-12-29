import { CompanyAccount } from "./class/CompanyAccount";
import { OtherAccount } from "./class/OtherAccount";
import { PeopleAccount } from "./class/PeopleAccount";

const companyAccount: CompanyAccount = new CompanyAccount('Nome da empresa', 1)
const peopleAccount: PeopleAccount = new PeopleAccount('Brendon', 2, 22222222222)
const otherAccount: OtherAccount = new OtherAccount('Outra conta', 33)

console.log('-----------PEOPLE ACCOUNT-----------');
console.log('INFORMAÇÕES DA CONTA:');
console.log(`Nome: ${peopleAccount.getName()}\nNúmero da conta: ${peopleAccount.getAccountNumber()}\nSaldo: ${peopleAccount.getBalance()}\nStatus da conta: ${peopleAccount.validateStatus()}`)
console.log('\n----TESTES COM STATUS VÁLIDO----');
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', peopleAccount.getBalance())
try {
    peopleAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', peopleAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', peopleAccount.getBalance())
try {
    peopleAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', peopleAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 600:');
console.log('Saldo antes do saque:', peopleAccount.getBalance())
try {
    peopleAccount.withdraw(600)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', peopleAccount.getBalance())
console.log('\n----TESTES COM STATUS INVÁLIDO----');
peopleAccount.setStatus(false)
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', peopleAccount.getBalance())
try {
    peopleAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', peopleAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', peopleAccount.getBalance())
try {
    peopleAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', peopleAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 600:');
console.log('Saldo antes do saque:', peopleAccount.getBalance())
try {
    peopleAccount.withdraw(600)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', peopleAccount.getBalance())



console.log('\n\n-----------COMPANY ACCOUNT-----------');
console.log('INFORMAÇÕES DA CONTA:');
console.log(`Nome: ${companyAccount.getName()}\nNúmero da conta: ${companyAccount.getAccountNumber()}\nSaldo: ${companyAccount.getBalance()}\nStatus da conta: ${companyAccount.validateStatus()}`)
console.log('\n----TESTES COM STATUS VÁLIDO----');
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', companyAccount.getBalance())
try {
    companyAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('PEGANDO EMPRÉSTIMO DE 1000:');
console.log('Saldo antes do empréstimo:', companyAccount.getBalance())
try {
    companyAccount.getLoan(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do empréstimo:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', companyAccount.getBalance())
try {
    companyAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 3000:');
console.log('Saldo antes do saque:', companyAccount.getBalance())
try {
    companyAccount.withdraw(3000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', companyAccount.getBalance())
console.log('\n----TESTES COM STATUS INVÁLIDO----');
companyAccount.setStatus(false)
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', companyAccount.getBalance())
try {
    companyAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('PEGANDO EMPRÉSTIMO DE 1000:');
console.log('Saldo antes do empréstimo:', companyAccount.getBalance())
try {
    companyAccount.getLoan(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do empréstimo:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', companyAccount.getBalance())
try {
    companyAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', companyAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 3000:');
console.log('Saldo antes do saque:', companyAccount.getBalance())
try {
    companyAccount.withdraw(3000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', companyAccount.getBalance())



console.log('\n\n-----------OTHER ACCOUNT-----------');
console.log('INFORMAÇÕES DA CONTA:');
console.log(`Nome: ${otherAccount.getName()}\nNúmero da conta: ${otherAccount.getAccountNumber()}\nSaldo: ${otherAccount.getBalance()}\nStatus da conta: ${otherAccount.validateStatus()}`)
console.log('\n----TESTES COM STATUS VÁLIDO----');
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', otherAccount.getBalance())
try {
    otherAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', otherAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', otherAccount.getBalance())
try {
    otherAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', otherAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 3000:');
console.log('Saldo antes do saque:', otherAccount.getBalance())
try {
    otherAccount.withdraw(3000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', otherAccount.getBalance())
console.log('\n----TESTES COM STATUS INVÁLIDO----');
otherAccount.setStatus(false)
console.log('DEPOSITANDO 1000:');
console.log('Saldo antes do depósito:', otherAccount.getBalance())
try {
    otherAccount.deposit(1000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do depósito:', otherAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 500:');
console.log('Saldo antes do saque:', otherAccount.getBalance())
try {
    otherAccount.withdraw(500)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', otherAccount.getBalance())
console.log('------//------//------//------')
console.log('SACANDO 3000:');
console.log('Saldo antes do saque:', otherAccount.getBalance())
try {
    otherAccount.withdraw(3000)
} catch (error: any) {
    console.log(error.message)
}
console.log('Saldo depois do saque:', otherAccount.getBalance())



