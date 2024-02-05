import { EntityManager } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createUser = async (user: User) => {
        return await this.manager.save(user);
    };

    getUser = async (userId: string): Promise<User | null> => {
        return await this.manager.findOne(User, {
            where: { id_user: userId }
        });
    };

    getUserByEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
        return await this.manager.findOne(User, {
            where: {
                email, password,
            }
        })
    };

    getAllUsers = async (): Promise<User[]> => {
        return await this.manager.find(User);
    };

    deleteUser = async (userId: string): Promise<boolean> => {
        const isUserExist: boolean = await this.manager.exists(User, {
            where: {
                id_user: userId
            }
        });

        if (isUserExist) {
            await this.manager.delete(User, {
                id_user: userId
            });
        }
        return isUserExist;
    };
}