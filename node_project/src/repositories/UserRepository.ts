import { Firestore, and, collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { User } from "../entities/User";

export class UserRepository {
    private database: Firestore;

    constructor(database: Firestore) {
        this.database = database;
    }

    createUser = async (user: User) => {
        const document = doc(this.database, "users", user.id_user);
        await setDoc(document, {
            name: user.name,
            email: user.email,
            password: user.password,
        });
    };

    getUser = async (userId: string): Promise<User | null> => {
        const document = await getDoc(doc(this.database, "users", userId));

        if (document.exists()) {
            return {
                id_user: document.id,
                name: document.data().name,
                email: document.data().email,
                password: document.data().password,
            };
        }
        return null;
    };

    getUserByEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
        const q = query(collection(this.database, 'users'), and(where("email", "==", email), where("password", "==", password)), limit(1));

        const snapshot = (await getDocs(q));

        if (snapshot.empty) {
            return null;
        }

        const document = snapshot.docs[0];
        document.ref
        return {
            id_user: document.id,
            name: document.data().name,
            email: document.data().email,
            password: document.data().password,
        }

    };

    getAllUsers = async (): Promise<User[]> => {
        return (await getDocs(collection(this.database, "users"))).docs.map((document) => {
            return {
                id_user: document.id,
                name: document.data().name,
                email: document.data().email,
                password: document.data().password,
            }
        });
    };

    deleteUser = async (userId: string): Promise<boolean> => {
        const document = doc(this.database, 'users', userId);
        const user = await getDoc(document);
        const isUserExist: boolean = user.exists();

        if (isUserExist) {
            return await deleteDoc(document).then(() => true);
        }
        return isUserExist;
    };
}