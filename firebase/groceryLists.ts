import { getApp } from '@react-native-firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from '@react-native-firebase/firestore';

export interface GroceryItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface GroceryList {
    id: string;
    title: string;
    owner: string;
    createdAt: Date;
    isPinned?: boolean;
    items: GroceryItem[];
}

const firestore = getFirestore(getApp());
const groceryListsCollection = collection(firestore, 'groceryLists');

// CREATE
export const addGroceryList = async (
    title: string,
    owner: string,
    items: GroceryItem[] = []
): Promise<string> => { // ⬅️ Changed from Promise<void> to Promise<string>
    if (!title.trim()) throw new Error('Title is required'); // ⬅️ Changed from return to throw

    const docRef = await addDoc(groceryListsCollection, {
        title: title.trim(),
        owner,
        items,
        isPinned: false,
        createdAt: serverTimestamp(),
    });

    return docRef.id; // ⬅️ Return the document ID
};

// READ 
export const subscribeGroceryLists = (
    onUpdate: (lists: GroceryList[]) => void,
    onError?: (error: Error) => void
) => {
    const listsQuery = query(groceryListsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
        listsQuery,
        (snapshot) => {
            const lists: GroceryList[] = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as GroceryList[];

            onUpdate(lists);
        },
        (error) => {
            console.error('Error fetching grocery lists:', error);
            onError?.(error);
        }
    );
};

// UPDATE
export const updateGroceryList = async (
    id: string,
    updates: Partial<Omit<GroceryList, 'id' | 'createdAt'>>
): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, updates);
};

// UPDATE 
export const togglePin = async (id: string, currentPinStatus: boolean): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await updateDoc(listDoc, {
        isPinned: !currentPinStatus,
    });
};

// DELETE 
export const deleteGroceryList = async (id: string): Promise<void> => {
    const listDoc = doc(firestore, 'groceryLists', id);
    await deleteDoc(listDoc);
};