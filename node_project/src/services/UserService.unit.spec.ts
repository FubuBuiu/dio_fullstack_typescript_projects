import { IUser, UserService } from "./UserService";

describe('UserService tests', () => {
    let mockDb: IUser[];
    let userService: UserService;
    const mockUser = {
        name: 'Brendon',
        email: 'brendon@dio.com',
        password: 'brendon123',
    }

    beforeEach(() => {
        mockDb = [];
        userService = new UserService(mockDb);
    });

    it('should create new user', () => {
        expect(mockDb.length).toBe(0);
        userService.createUser(mockUser);
        expect(mockDb.length).toBe(1);
    });
    it('should return all users', () => {
        userService.createUser(mockUser);

        const userList = userService.getAllUsers();

        expect(userList).toBe(mockDb);
    });
    it('should delete user', () => {
        const otherUser = {
            name: 'Lucas',
            email: 'lucas@dio.com',
            password: 'lucas123',
        };

        userService.createUser(mockUser);
        userService.createUser(otherUser);

        expect(mockDb.length).toBe(2);
        const isDeleted = userService.deleteUser('2');
        expect(isDeleted).toBeTruthy();
        expect(mockDb.length).toBe(1);
    });
    it('should return undefined when try delete a user that not exist', () => {
        const id: string = 'userIdThatDoesNotExist';
        userService.createUser(mockUser);

        expect(mockDb.length).toBe(1);
        const isDeleted: boolean = userService.deleteUser(id);
        expect(isDeleted).toBeFalsy();
        expect(mockDb.length).toBe(1);
    });
    it('should return user when it exist', () => {
        const id: string = '1';
        const otherUser = {
            id,
            name: 'Lucas',
            email: 'lucas@dio.com',
            password: 'lucas123',
        };

        mockDb.push(otherUser);

        const user: IUser | undefined = userService.getUser(id);

        expect(user).toBeDefined();
        expect(user).toEqual(otherUser);
    });
    it('should return undefined when the user does not exist', () => {
        const id: string = 'userIdThatDoesNotExist';

        userService.createUser(mockUser);

        const user: IUser | undefined = userService.getUser(id);

        expect(user).not.toBeDefined();
    });
});