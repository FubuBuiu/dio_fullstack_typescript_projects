import { Firestore, and, collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore";
import { User } from "../entities/User";

export class UserRepository {
    private database: Firestore;

    constructor(database: Firestore) {
        this.database = database;
    }

    createUser = async (user: User) => {
        const { id, ...userData } = user;
        const docRef = doc(this.database, "users", id);
        await setDoc(docRef, {
            ...userData,
        });
    };

    updateUser = async (userId: string, newUserData: Partial<Omit<User, 'id'>>) => {
        const docRef = doc(this.database, "users", userId);
        await updateDoc(docRef, {
            ...newUserData
        });
    };

    getUser = async (userId: string): Promise<User | null> => {
        const document = await getDoc(doc(this.database, "users", userId));

        if (document.exists()) {
            return {
                id: document.id,
                name: document.data().name,
                cpf: document.data().cpf,
                adress: document.data().adress,
                phone: document.data().phone,
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

        return {
            id: document.id,
            name: document.data().name,
            cpf: document.data().cpf,
            adress: document.data().adress,
            phone: document.data().phone,
            email: document.data().email,
            password: document.data().password,
        }

    };

    getAllUsers = async (): Promise<User[]> => {
        return (await getDocs(collection(this.database, "users"))).docs.map((document) => {
            return {
                id: document.id,
                name: document.data().name,
                cpf: document.data().cpf,
                adress: document.data().adress,
                phone: document.data().phone,
                email: document.data().email,
                password: document.data().password,
            }
        });
    };

    deleteUser = async (userId: string) => {
        const document = doc(this.database, 'users', userId);
        await deleteDoc(document);

    };
}