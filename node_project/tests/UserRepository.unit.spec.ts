import { Firestore } from "firebase/firestore";
import { User } from "../src/entities/User";
import { UserRepository } from "../src/repositories/UserRepository";
import { getMockFirestoreManager } from "./__mocks__/mockFirestoreFunctions.mock";

let firestoreManager = getMockFirestoreManager({});

jest.mock('firebase/firestore', () => {
    return {
        limit: jest.fn(() => firestoreManager.limit()),
        and: jest.fn(() => firestoreManager.and()),
        where: jest.fn(() => firestoreManager.where()),
        collection: jest.fn(() => firestoreManager.collection()),
        query: jest.fn(() => firestoreManager.query()),
        doc: jest.fn(() => firestoreManager.doc()),
        setDoc: jest.fn(() => firestoreManager.setDoc()),
        getDoc: jest.fn(() => firestoreManager.getDoc()),
        getDocs: jest.fn(() => firestoreManager.getDocs()),
        deleteDoc: jest.fn(() => firestoreManager.deleteDoc()),
    };
});

describe('UserRepository tests:', () => {
    const userRepository = new UserRepository({} as Firestore);

    const mockUser = {
        id: '12345',
        name: 'Test Username',
        email: 'user@dio.com',
        password: 'user123',
    };

    describe('- Create user', () => {
        it('should add new user in data base', async () => {

            await userRepository.createUser(mockUser);

            expect(firestoreManager.setDoc).toHaveBeenCalledTimes(1);
        });
    });
    describe('- Get user', () => {

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });

        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return user when it exist in database', async () => {

            const userId = '12345';

            firestoreManager = getMockFirestoreManager({
                getDocReturn: {
                    id: userId,
                    data: () => mockUser,
                    exists: () => true
                }
            })

            const response = await userRepository.getUser(userId);

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(response).toMatchObject<User>(mockUser);
        });

        it('should return null when user not exist in database', async () => {

            const response = await userRepository.getUser('idThatNotExist');

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(response).toBeNull();
        });
    });
    describe('- Get user by email and password', () => {



        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });

        afterEach(() => jest.clearAllMocks());

        it('should return user when find email and password in database', async () => {
            const email = 'user@dio.com';
            const password = '12345';

            firestoreManager = getMockFirestoreManager({
                getDocsReturn: {
                    docs: [{
                        id: '12345',
                        data: () => mockUser,
                        exists: () => true,
                    }],
                    empty: false,
                }
            });

            const response = await userRepository.getUserByEmailAndPassword(email, password);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(response).toMatchObject<User>(mockUser);
        });

        it('should return null when not find email and password in database', async () => {
            const email = 'emailThatNotExist';
            const password = 'passwordThatNotExist';

            const response = await userRepository.getUserByEmailAndPassword(email, password);

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(response).toBeNull();
        });
    });
    describe('- Delete user', () => {

        beforeEach(() => {
            firestoreManager = getMockFirestoreManager({});
        });

        afterEach(() => jest.clearAllMocks());

        it('should return true when user exist to delete', async () => {
            const userId: string = 'userId';

            firestoreManager = getMockFirestoreManager({
                getDocReturn: {
                    id: userId,
                    data: () => mockUser,
                    exists: () => true,
                }
            });

            const response: boolean = await userRepository.deleteUser(userId);

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(firestoreManager.deleteDoc).toHaveBeenCalledTimes(1);
            expect(response).toBe(true);
        });
        it('should return false when user not exist to delete', async () => {

            const response: boolean = await userRepository.deleteUser('userId');

            expect(firestoreManager.getDoc).toHaveBeenCalledTimes(1);
            expect(firestoreManager.deleteDoc).not.toHaveBeenCalled();
            expect(response).toBe(false);
        });
    });
    describe('- Get all users', () => {
        it('should return all users', async () => {
            firestoreManager = getMockFirestoreManager({
                getDocsReturn: {
                    docs: [],
                    empty: true,
                }
            });

            const response: User[] = await userRepository.getAllUsers();

            expect(firestoreManager.getDocs).toHaveBeenCalledTimes(1);
            expect(response).toStrictEqual<User[]>(Array<User>());
        });
    });

});