import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

interface GetDocsReturnType {
    docs: Partial<QueryDocumentSnapshot>[];
    empty: boolean;
}

interface MockFirestoreManagerArgs {
    getDocReturn?: Partial<DocumentSnapshot>;
    getDocsReturn?: GetDocsReturnType;
}

export const getMockFirestoreManager = ({
    getDocReturn = {
        id: 'userId',
        data: undefined,
        exists: () => false
    },
    getDocsReturn = {
        docs: [],
        empty: true,
    }
}: MockFirestoreManagerArgs) => {
    return {
        limit: jest.fn(),
        and: jest.fn(),
        where: jest.fn(),
        collection: jest.fn(),
        query: jest.fn(),
        doc: jest.fn(),
        setDoc: jest.fn(),
        getDoc: jest.fn().mockImplementation(() => Promise.resolve(getDocReturn)),
        getDocs: jest.fn().mockImplementation(() => Promise.resolve(getDocsReturn)),
        deleteDoc: jest.fn().mockImplementation(() => Promise.resolve()),
    };
};