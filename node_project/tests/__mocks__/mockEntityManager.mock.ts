import { EntityManager } from "typeorm";

interface MockManagerArgs {
    saveReturn?: object | [object];
    findOneReturn?: object;
    existsReturn?: boolean;
    findReturn?: Array<any>;
}

export const getMockEntityManager = async ({
    saveReturn = undefined,
    findOneReturn = undefined,
    existsReturn = false,
    findReturn = [],
}: MockManagerArgs): Promise<EntityManager> => {
    const manager: Partial<EntityManager> = {};

    manager.save = jest.fn().mockImplementation(() => Promise.resolve(saveReturn));
    manager.findOne = jest.fn().mockImplementation(() => Promise.resolve(findOneReturn));
    manager.exists = jest.fn().mockImplementation(() => Promise.resolve(existsReturn));
    manager.delete = jest.fn();
    manager.find = jest.fn().mockImplementation(() => Promise.resolve(findReturn));

    return manager as EntityManager;
};