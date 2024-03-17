import { Router } from "express";
import { UserController } from './controllers/UserController';
import { LoginController } from "./controllers/LoginController";
import { verifyAuth } from "./midleware/verifyAuth";
import { BankAccountController } from "./controllers/BankAccountController";

export const router = Router();

const userController = new UserController();
const loginController = new LoginController();
const bankAccountController = new BankAccountController();

//TODO Adicionar validação de token para end points importantes

//----USER----

router.get('/users', userController.getAllUsers);

router.get('/users/:id?', verifyAuth, userController.getUser);

router.delete('/users/:id?', userController.deleteUser);

router.put('/users/:id?', userController.updateUser);

router.post('/users', userController.createUser);

router.post('/login', loginController.login);

//----BANK ACCOUNT----

router.get('/bankAccounts/account/:id?', bankAccountController.getBankAccountById);

router.get('/bankAccounts/account/:currentAccount?/:agency?', bankAccountController.getBankAccountByAccountAndAgency);

router.post('/bankAccounts/transfer', bankAccountController.makeTranser);

router.post('/bankAccounts/pix/create', bankAccountController.updatePixKey);

router.get('/bankAccounts', bankAccountController.getAllBankAccounts);