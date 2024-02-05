import { EntityManager } from "typeorm";
import { getMockEntityManager } from "./__mocks__/mockEntityManager.mock";
import { User } from "../src/entities/User";
import { UserRepository } from "../src/repositories/UserRepository";

describe('UserRepository tests:', () => {
    let userRepository: UserRepository;
    let managerMock: Partial<EntityManager>;

    const mockUser = {
        id_user: '12345',
        name: 'Test Username',
        email: 'user@dio.com',
        password: 'user123',
    };

    describe('- Create user', () => {
        it('should add new user in data base', async () => {
            managerMock = await getMockEntityManager({ saveReturn: mockUser });
            userRepository = new UserRepository(managerMock as EntityManager);

            const response = await userRepository.createUser(mockUser);

            expect(managerMock.save).toHaveBeenCalledTimes(1);
            expect(response).toMatchObject<User>(mockUser);
        });
    });
    describe('- Get user', () => {

        beforeEach(async () => {
            managerMock = await getMockEntityManager({});
        });

        it('should return user when it exist in database', async () => {
            managerMock = await getMockEntityManager({ findOneReturn: mockUser });

            userRepository = new UserRepository(managerMock as EntityManager);

            const response = await userRepository.getUser('12345');

            expect(managerMock.findOne).toHaveBeenCalledTimes(1);
            expect(response).toMatchObject<User>(mockUser);
        });

        it('should return null when user not exist in database', async () => {
            userRepository = new UserRepository(managerMock as EntityManager);

            const response = await userRepository.getUser('idThatNotExist');

            expect(managerMock.findOne).toHaveBeenCalledTimes(1);
            expect(response).not.toBeDefined();
        });
    });
    describe('- Get user by email and password', () => {

        beforeEach(async () => {
            managerMock = await getMockEntityManager({});
        });

        it('should return user when find email and password in database', async () => {
            const email = 'user@dio.com';
            const password = '12345';

            managerMock = await getMockEntityManager({ findOneReturn: mockUser });

            userRepository = new UserRepository(managerMock as EntityManager);

            const response = await userRepository.getUserByEmailAndPassword(email, password);

            expect(managerMock.findOne).toHaveBeenCalledTimes(1);
            expect(response).toMatchObject<User>(mockUser);
        });

        it('should return null when not find email and password in database', async () => {
            const email = 'emailThatNotExist';
            const password = 'passwordThatNotExist';

            userRepository = new UserRepository(managerMock as EntityManager);

            const response = await userRepository.getUserByEmailAndPassword(email, password);

            expect(managerMock.findOne).toHaveBeenCalledTimes(1);
            expect(response).not.toBeDefined();
        });
    });
    describe('- Delete user', () => {
        beforeEach(async () => {
            managerMock = await getMockEntityManager({})
        });

        it('should return true when user exist to delete', async () => {
            managerMock = await getMockEntityManager({
                existsReturn: true,
            });
            userRepository = new UserRepository(managerMock as EntityManager);

            const response: boolean = await userRepository.deleteUser('userId');

            expect(managerMock.exists).toHaveBeenCalledTimes(1);
            expect(managerMock.delete).toHaveBeenCalledTimes(1);
            expect(response).toBe(true);
        });
        it('should return false when user not exist to delete', async () => {
            userRepository = new UserRepository(managerMock as EntityManager);

            const response: boolean = await userRepository.deleteUser('userId');

            expect(managerMock.exists).toHaveBeenCalledTimes(1);
            expect(managerMock.delete).not.toHaveBeenCalled();
            expect(response).toBe(false);
        });
    });
    describe('- Get all users', () => {
        it('should return all users', async () => {
            managerMock = await getMockEntityManager({ findReturn: Array<User>() });
            userRepository = new UserRepository(managerMock as EntityManager);

            const response: User[] = await userRepository.getAllUsers();

            expect(managerMock.find).toHaveBeenCalledTimes(1);
            expect(response).toStrictEqual<User[]>(Array<User>());
        });
    });

});